import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { registerFCMTokenSchema } from "./validation";

const router = Router();
router.use(authenticate);

// ─── GET /api/notifications ─────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.sub },
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: { userId: req.user!.sub } }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ success: false, error: "Failed to get notifications" });
  }
});

// ─── PATCH /api/notifications/:id/read ──────────────────────
router.patch("/:id/read", async (req: Request, res: Response) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { isRead: true },
    });
    if (result.count === 0) {
      res.status(404).json({ success: false, error: "Notification not found" });
      return;
    }
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ success: false, error: "Failed to mark notification as read" });
  }
});

// ─── POST /api/notifications/read-all ───────────────────────
router.post("/read-all", async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.sub, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Read all error:", err);
    res.status(500).json({ success: false, error: "Failed to mark all as read" });
  }
});

// ─── POST /api/notifications/fcm-token ──────────────────────
router.post("/fcm-token", async (req: Request, res: Response) => {
  try {
    const { token, platform } = registerFCMTokenSchema.parse(req.body);

    await prisma.fCMToken.upsert({
      where: { token },
      update: { userId: req.user!.sub, platform },
      create: { userId: req.user!.sub, token, platform },
    });

    res.json({ success: true, message: "FCM token registered" });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Register FCM error:", err);
    res.status(500).json({ success: false, error: "Failed to register FCM token" });
  }
});

export default router;
