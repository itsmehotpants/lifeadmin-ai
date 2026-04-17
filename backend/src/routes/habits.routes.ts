import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { createHabitSchema, updateHabitSchema, logHabitSchema } from "./validation";

const router = Router();
router.use(authenticate);

// ─── GET /api/habits/today ──────────────────────────────────
router.get("/today", async (req: Request, res: Response) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user!.sub, isActive: true },
      include: {
        logs: {
          where: {
            loggedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const habitsWithStatus = habits.map((h) => ({
      ...h,
      completedToday: h.logs.length >= h.targetCount,
      todayCount: h.logs.length,
    }));

    res.json({ success: true, data: habitsWithStatus });
  } catch (err) {
    console.error("Get today habits error:", err);
    res.status(500).json({ success: false, error: "Failed to get today's habits" });
  }
});

// ─── GET /api/habits ────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: habits });
  } catch (err) {
    console.error("Get habits error:", err);
    res.status(500).json({ success: false, error: "Failed to get habits" });
  }
});

// ─── POST /api/habits ───────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = createHabitSchema.parse(req.body);
    const habit = await prisma.habit.create({
      data: { userId: req.user!.sub, ...data },
    });
    res.status(201).json({ success: true, data: habit });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Create habit error:", err);
    res.status(500).json({ success: false, error: "Failed to create habit" });
  }
});

// ─── PUT /api/habits/:id ────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data = updateHabitSchema.parse(req.body);
    const result = await prisma.habit.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data,
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Habit not found" });
      return;
    }
    const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: habit });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Update habit error:", err);
    res.status(500).json({ success: false, error: "Failed to update habit" });
  }
});

// ─── DELETE /api/habits/:id ─────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.habit.deleteMany({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Habit not found" });
      return;
    }
    res.json({ success: true, message: "Habit deleted" });
  } catch (err) {
    console.error("Delete habit error:", err);
    res.status(500).json({ success: false, error: "Failed to delete habit" });
  }
});

// ─── POST /api/habits/:id/log ───────────────────────────────
router.post("/:id/log", async (req: Request, res: Response) => {
  try {
    const data = logHabitSchema.parse(req.body);

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (!habit) {
      res.status(404).json({ success: false, error: "Habit not found" });
      return;
    }

    // Create log entry
    const log = await prisma.habitLog.create({
      data: {
        habitId: habit.id,
        userId: req.user!.sub,
        note: data.note,
      },
    });

    // Update streak and completions
    const updatedHabit = await prisma.habit.update({
      where: { id: habit.id },
      data: {
        totalCompletions: { increment: 1 },
        currentStreak: { increment: 1 },
        longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
      },
    });

    res.status(201).json({ success: true, data: { log, habit: updatedHabit } });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Log habit error:", err);
    res.status(500).json({ success: false, error: "Failed to log habit" });
  }
});

// ─── GET /api/habits/:id/stats ──────────────────────────────
router.get("/:id/stats", async (req: Request, res: Response) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (!habit) {
      res.status(404).json({ success: false, error: "Habit not found" });
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await prisma.habitLog.findMany({
      where: {
        habitId: habit.id,
        loggedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { loggedAt: "asc" },
    });

    // Build daily completion map
    const dailyMap: Record<string, number> = {};
    logs.forEach((log) => {
      const dateKey = log.loggedAt.toISOString().split("T")[0];
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        habit,
        last30Days: dailyMap,
        totalLast30: logs.length,
        completionRate: Math.round((Object.keys(dailyMap).length / 30) * 100),
      },
    });
  } catch (err) {
    console.error("Get habit stats error:", err);
    res.status(500).json({ success: false, error: "Failed to get habit stats" });
  }
});

export default router;
