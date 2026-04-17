import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { requirePlan } from "../middleware/subscription.middleware";
import { createGoalSchema, updateGoalSchema, updateProgressSchema } from "./validation";

const router = Router();
router.use(authenticate);

// ─── GET /api/goals ─────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user!.sub },
      orderBy: { targetDate: "asc" },
    });
    res.json({ success: true, data: goals });
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ success: false, error: "Failed to get goals" });
  }
});

// ─── POST /api/goals ────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = createGoalSchema.parse(req.body);
    const goal = await prisma.goal.create({
      data: {
        userId: req.user!.sub,
        title: data.title,
        description: data.description,
        category: data.category as any,
        targetDate: new Date(data.targetDate),
        milestones: data.milestones as any,
      },
    });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Create goal error:", err);
    res.status(500).json({ success: false, error: "Failed to create goal" });
  }
});

// ─── PUT /api/goals/:id ─────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data = updateGoalSchema.parse(req.body);
    const result = await prisma.goal.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        milestones: data.milestones as any,
        category: data.category as any,
      },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Goal not found" });
      return;
    }
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: goal });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Update goal error:", err);
    res.status(500).json({ success: false, error: "Failed to update goal" });
  }
});

// ─── DELETE /api/goals/:id ──────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.goal.deleteMany({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Goal not found" });
      return;
    }
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ success: false, error: "Failed to delete goal" });
  }
});

// ─── POST /api/goals/:id/generate-plan (AI) ─────────────────
router.post("/:id/generate-plan", requirePlan("PREMIUM"), async (req: Request, res: Response) => {
  try {
    const goal = await prisma.goal.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (!goal) {
      res.status(404).json({ success: false, error: "Goal not found" });
      return;
    }

    // TODO: Integrate with AI service to generate weekly plan
    res.json({
      success: true,
      data: { message: "AI plan generation coming soon" },
    });
  } catch (err) {
    console.error("Generate plan error:", err);
    res.status(500).json({ success: false, error: "Failed to generate plan" });
  }
});

// ─── PATCH /api/goals/:id/progress ──────────────────────────
router.patch("/:id/progress", async (req: Request, res: Response) => {
  try {
    const { progressPercent } = updateProgressSchema.parse(req.body);
    const result = await prisma.goal.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { progressPercent },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Goal not found" });
      return;
    }
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: goal });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Update progress error:", err);
    res.status(500).json({ success: false, error: "Failed to update progress" });
  }
});

export default router;
