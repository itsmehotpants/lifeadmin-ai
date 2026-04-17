import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { requirePlan } from "../middleware/subscription.middleware";

const router = Router();
router.use(authenticate);

// ─── GET /api/analytics/dashboard ───────────────────────────
router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [todayTasks, completedToday, overdueTasks, upcomingWeek, habits, financeAlerts, behaviorProfile] =
      await Promise.all([
        prisma.task.count({
          where: {
            userId,
            status: { in: ["PENDING", "IN_PROGRESS"] },
            dueDate: { gte: startOfDay, lte: endOfDay },
          },
        }),
        prisma.task.count({
          where: {
            userId,
            status: "COMPLETED",
            completedAt: { gte: startOfDay },
          },
        }),
        prisma.task.count({
          where: {
            userId,
            status: { in: ["PENDING", "IN_PROGRESS"] },
            dueDate: { lt: new Date() },
          },
        }),
        prisma.task.count({
          where: {
            userId,
            status: { in: ["PENDING", "IN_PROGRESS"] },
            dueDate: { gte: new Date(), lte: endOfWeek },
          },
        }),
        prisma.habit.findMany({
          where: { userId, isActive: true },
          select: { name: true, currentStreak: true, targetCount: true, icon: true },
        }),
        prisma.financialItem.findMany({
          where: {
            userId,
            isPaid: false,
            dueDate: { gte: new Date(), lte: endOfWeek },
          },
          select: { name: true, amount: true, dueDate: true, lateFeeAmount: true },
        }),
        prisma.behaviorProfile.findUnique({ where: { userId } }),
      ]);

    res.json({
      success: true,
      data: {
        todayTasks,
        completedToday,
        overdueTasks,
        upcomingThisWeek: upcomingWeek,
        disciplineScore: behaviorProfile?.disciplineScore || 50,
        habitStreaks: habits.map((h) => ({
          name: h.name,
          current: h.currentStreak,
          target: h.targetCount,
          icon: h.icon,
        })),
        financeAlerts: financeAlerts.map((f) => ({
          name: f.name,
          dueIn: f.dueDate
            ? Math.ceil((f.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : 0,
          amount: f.amount,
          lateFee: f.lateFeeAmount,
        })),
      },
    });
  } catch (err) {
    console.error("Get dashboard error:", err);
    res.status(500).json({ success: false, error: "Failed to get dashboard data" });
  }
});

// ─── GET /api/analytics/weekly ──────────────────────────────
router.get("/weekly", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalTasks, completedTasks, tasksByCategory] = await Promise.all([
      prisma.task.count({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.task.count({
        where: { userId, status: "COMPLETED", completedAt: { gte: sevenDaysAgo } },
      }),
      prisma.task.groupBy({
        by: ["category"],
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        _count: { id: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        totalTasks,
        completedTasks,
        tasksByCategory: tasksByCategory.map((c) => ({
          category: c.category,
          count: c._count.id,
        })),
      },
    });
  } catch (err) {
    console.error("Get weekly analytics error:", err);
    res.status(500).json({ success: false, error: "Failed to get weekly analytics" });
  }
});

// ─── GET /api/analytics/behavior ────────────────────────────
router.get("/behavior", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const profile = await prisma.behaviorProfile.findUnique({
      where: { userId: req.user!.sub },
    });

    if (!profile) {
      res.json({
        success: true,
        data: {
          avgCompletionRate: 0,
          peakProductivityHour: 10,
          weeklyCompletionMap: {},
          commonDelayPatterns: {},
          disciplineScore: 50,
          message: "Not enough data yet. Keep using LifeAdmin to build your profile!",
        },
      });
      return;
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    console.error("Get behavior error:", err);
    res.status(500).json({ success: false, error: "Failed to get behavior data" });
  }
});

// ─── GET /api/analytics/discipline-score ────────────────────
router.get("/discipline-score", async (req: Request, res: Response) => {
  try {
    const profile = await prisma.behaviorProfile.findUnique({
      where: { userId: req.user!.sub },
    });

    res.json({
      success: true,
      data: { score: profile?.disciplineScore || 50 },
    });
  } catch (err) {
    console.error("Get discipline score error:", err);
    res.status(500).json({ success: false, error: "Failed to get discipline score" });
  }
});

export default router;
