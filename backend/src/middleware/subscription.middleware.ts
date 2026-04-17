import { Request, Response, NextFunction } from "express";

type PlanTier = "FREE" | "PRO" | "PREMIUM";

const planHierarchy: Record<PlanTier, number> = {
  FREE: 0,
  PRO: 1,
  PREMIUM: 2,
};

/**
 * Subscription guard middleware — gates features by plan tier
 * Must be used AFTER authenticate middleware
 */
export const requirePlan = (minPlan: PlanTier) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userPlan = (req.user?.plan || "FREE") as PlanTier;

    if (planHierarchy[userPlan] < planHierarchy[minPlan]) {
      res.status(403).json({
        success: false,
        error: "Upgrade required",
        code: "PLAN_UPGRADE_REQUIRED",
        requiredPlan: minPlan,
        currentPlan: userPlan,
      });
      return;
    }
    next();
  };
};
