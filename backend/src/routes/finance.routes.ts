import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { createFinancialItemSchema, updateFinancialItemSchema } from "./validation";

const router = Router();
router.use(authenticate);

// ─── GET /api/finance/upcoming ──────────────────────────────
router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const items = await prisma.financialItem.findMany({
      where: {
        userId: req.user!.sub,
        isPaid: false,
        OR: [
          { dueDate: { gte: new Date(), lte: futureDate } },
          { dueDay: { not: null } },
        ],
      },
      orderBy: { dueDate: "asc" },
    });

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Get upcoming finance error:", err);
    res.status(500).json({ success: false, error: "Failed to get upcoming items" });
  }
});

// ─── GET /api/finance/summary ───────────────────────────────
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const items = await prisma.financialItem.findMany({
      where: { userId: req.user!.sub },
    });

    const totalMonthly = items
      .filter((i) => i.isRecurring)
      .reduce((sum, i) => sum + i.amount, 0);

    const unpaidCount = items.filter((i) => !i.isPaid).length;
    const totalLateFeeRisk = items
      .filter((i) => !i.isPaid && i.lateFeeAmount)
      .reduce((sum, i) => sum + (i.lateFeeAmount || 0), 0);

    const byType = items.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + item.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    res.json({
      success: true,
      data: {
        totalMonthlyObligations: totalMonthly,
        unpaidCount,
        totalLateFeeRisk,
        byType,
        totalItems: items.length,
      },
    });
  } catch (err) {
    console.error("Get finance summary error:", err);
    res.status(500).json({ success: false, error: "Failed to get summary" });
  }
});

// ─── GET /api/finance ───────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await prisma.financialItem.findMany({
      where: { userId: req.user!.sub },
      orderBy: [{ isPaid: "asc" }, { dueDate: "asc" }],
    });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Get finance error:", err);
    res.status(500).json({ success: false, error: "Failed to get financial items" });
  }
});

// ─── POST /api/finance ──────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = createFinancialItemSchema.parse(req.body);
    const item = await prisma.financialItem.create({
      data: {
        userId: req.user!.sub,
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Create finance error:", err);
    res.status(500).json({ success: false, error: "Failed to create financial item" });
  }
});

// ─── PUT /api/finance/:id ───────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data = updateFinancialItemSchema.parse(req.body);
    const result = await prisma.financialItem.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Financial item not found" });
      return;
    }
    const item = await prisma.financialItem.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: item });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Update finance error:", err);
    res.status(500).json({ success: false, error: "Failed to update financial item" });
  }
});

// ─── DELETE /api/finance/:id ────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.financialItem.deleteMany({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Financial item not found" });
      return;
    }
    res.json({ success: true, message: "Financial item deleted" });
  } catch (err) {
    console.error("Delete finance error:", err);
    res.status(500).json({ success: false, error: "Failed to delete financial item" });
  }
});

// ─── PATCH /api/finance/:id/mark-paid ───────────────────────
router.patch("/:id/mark-paid", async (req: Request, res: Response) => {
  try {
    const result = await prisma.financialItem.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { isPaid: true, lastPaidAt: new Date() },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Financial item not found" });
      return;
    }
    const item = await prisma.financialItem.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("Mark paid error:", err);
    res.status(500).json({ success: false, error: "Failed to mark as paid" });
  }
});

export default router;
