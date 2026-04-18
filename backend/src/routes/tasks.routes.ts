import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { attachFamilyId } from "../middleware/family.middleware";
import { requirePlan } from "../middleware/subscription.middleware";
import { createTaskSchema, updateTaskSchema, parseTaskSchema, snoozeTaskSchema } from "./validation";

const router = Router();

// All task routes require authentication and family context
router.use(authenticate);
router.use(attachFamilyId);

// ─── IMPORTANT: Static routes BEFORE :id param routes ────────

// Helper to get task query filter
const getTaskFilter = (req: Request) => {
  const filters: any[] = [{ userId: req.user!.sub }];
  if (req.familyId) {
    filters.push({ familyId: req.familyId });
  }
  return { OR: filters };
};

// GET /api/tasks/today
router.get("/today", async (req: Request, res: Response) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        ...getTaskFilter(req),
        status: { in: ["PENDING", "IN_PROGRESS"] },
        OR: [
          { dueDate: { gte: startOfDay, lte: endOfDay } },
          { dueDate: null, createdAt: { gte: startOfDay } },
        ],
      },
      orderBy: [{ priority: "desc" }, { priorityScore: "desc" }],
    });

    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Get today tasks error:", err);
    res.status(500).json({ success: false, error: "Failed to get today's tasks" });
  }
});

// GET /api/tasks/overdue
router.get("/overdue", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        ...getTaskFilter(req),
        status: { in: ["PENDING", "IN_PROGRESS"] },
        dueDate: { lt: new Date() },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Get overdue tasks error:", err);
    res.status(500).json({ success: false, error: "Failed to get overdue tasks" });
  }
});

// GET /api/tasks/upcoming?days=7
router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user!.sub,
        status: { in: ["PENDING", "IN_PROGRESS"] },
        dueDate: { gte: new Date(), lte: futureDate },
      },
      orderBy: { dueDate: "asc" },
    });

    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Get upcoming tasks error:", err);
    res.status(500).json({ success: false, error: "Failed to get upcoming tasks" });
  }
});

// ─── GET /api/tasks ─────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, category, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      ...getTaskFilter(req),
    };

    if (category) where.category = category;
    if (status) where.status = status;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ priorityScore: "desc" }, { dueDate: "asc" }],
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ success: false, error: "Failed to get tasks" });
  }
});

// ─── POST /api/tasks ────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        userId: req.user!.sub,
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Create task error:", err);
    res.status(500).json({ success: false, error: "Failed to create task" });
  }
});

// ─── POST /api/tasks/parse (AI) ─────────────────────────────
router.post("/parse", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const { input } = parseTaskSchema.parse(req.body);

    // Dynamic import to avoid loading AI module when not needed
    const { parseTaskFromNaturalLanguage } = await import("../services/ai.service");
    const parsed = await parseTaskFromNaturalLanguage(input, req.user!.sub);

    res.json({ success: true, data: parsed });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Parse task error:", err);
    res.status(500).json({ success: false, error: "Failed to parse task" });
  }
});

// ─── GET /api/tasks/:id ─────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
      include: { reminders: true },
    });

    if (!task) {
      res.status(404).json({ success: false, error: "Task not found" });
      return;
    }

    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Get task error:", err);
    res.status(500).json({ success: false, error: "Failed to get task" });
  }
});

// ─── PUT /api/tasks/:id ─────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    if (task.count === 0) {
      res.status(404).json({ success: false, error: "Task not found" });
      return;
    }

    const updated = await prisma.task.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: updated });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Update task error:", err);
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
});

// ─── DELETE /api/tasks/:id ──────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.task.deleteMany({
      where: { id: req.params.id, userId: req.user!.sub },
    });

    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Task not found" });
      return;
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
});

// ─── PATCH /api/tasks/:id/complete ──────────────────────────
router.patch("/:id/complete", async (req: Request, res: Response) => {
  try {
    const result = await prisma.task.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Task not found" });
      return;
    }

    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ success: false, error: "Failed to complete task" });
  }
});

// ─── PATCH /api/tasks/:id/snooze ────────────────────────────
router.patch("/:id/snooze", async (req: Request, res: Response) => {
  try {
    const { snoozedUntil } = snoozeTaskSchema.parse(req.body);

    const result = await prisma.task.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { snoozedUntil: new Date(snoozedUntil) },
    });

    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Task not found" });
      return;
    }

    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: task });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Snooze task error:", err);
    res.status(500).json({ success: false, error: "Failed to snooze task" });
  }
});

export default router;
