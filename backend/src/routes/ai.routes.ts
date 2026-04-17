import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requirePlan } from "../middleware/subscription.middleware";
import { aiLimiter } from "../middleware/ratelimit.middleware";
import {
  parseTaskFromNaturalLanguage,
  generateWeeklyInsights,
  checkWorkloadBalance,
} from "../services/ai.service";

const router = Router();

// All AI routes require auth + rate limiting
router.use(authenticate);
router.use(aiLimiter);

// ─── POST /api/ai/parse-task ────────────────────────────────
router.post("/parse-task", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const { input } = req.body;
    if (!input || input.length < 3) {
      res.status(400).json({ success: false, error: "Input must be at least 3 characters" });
      return;
    }

    const parsed = await parseTaskFromNaturalLanguage(input, req.user!.sub);
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("AI parse error:", err);
    res.status(500).json({ success: false, error: "AI parsing failed" });
  }
});

// ─── POST /api/ai/weekly-insights ───────────────────────────
router.post("/weekly-insights", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const insights = await generateWeeklyInsights(req.user!.sub);
    res.json({ success: true, data: insights });
  } catch (err) {
    console.error("AI insights error:", err);
    res.status(500).json({ success: false, error: "Failed to generate insights" });
  }
});

// ─── POST /api/ai/workload-check ────────────────────────────
router.post("/workload-check", requirePlan("PRO"), async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ success: false, error: "Date is required" });
      return;
    }

    const result = await checkWorkloadBalance(req.user!.sub, date);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Workload check error:", err);
    res.status(500).json({ success: false, error: "Failed to check workload" });
  }
});

export default router;
