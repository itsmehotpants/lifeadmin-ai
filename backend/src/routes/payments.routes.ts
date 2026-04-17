import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);

// ─── POST /api/payments/create-order (Razorpay) ─────────────
router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      res.status(400).json({ success: false, error: "Plan ID is required" });
      return;
    }

    // TODO: Initialize Razorpay and create subscription
    // const { createRazorpaySubscription } = await import("../services/payment.service");
    // const subscription = await createRazorpaySubscription(req.user!.sub, planId);

    res.json({
      success: true,
      data: {
        message: "Razorpay integration ready — configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET",
        subscriptionId: "sub_placeholder",
      },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, error: "Failed to create payment order" });
  }
});

// ─── POST /api/payments/verify (Razorpay webhook) ───────────
router.post("/verify", async (req: Request, res: Response) => {
  try {
    // TODO: Verify Razorpay signature and activate subscription
    res.json({ success: true, message: "Payment verification placeholder" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});

// ─── POST /api/payments/stripe-session ──────────────────────
router.post("/stripe-session", async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body;
    if (!priceId) {
      res.status(400).json({ success: false, error: "Price ID is required" });
      return;
    }

    // TODO: Create Stripe checkout session
    res.json({
      success: true,
      data: {
        message: "Stripe integration ready — configure STRIPE_SECRET_KEY",
        url: "https://checkout.stripe.com/placeholder",
      },
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ success: false, error: "Failed to create Stripe session" });
  }
});

// ─── POST /api/payments/stripe-webhook ──────────────────────
router.post("/stripe-webhook", async (req: Request, res: Response) => {
  try {
    // TODO: Verify Stripe webhook signature and process event
    res.json({ success: true, message: "Stripe webhook placeholder" });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(500).json({ success: false, error: "Webhook processing failed" });
  }
});

// ─── GET /api/payments/subscription ─────────────────────────
router.get("/subscription", async (req: Request, res: Response) => {
  try {
    const { default: prisma } = await import("../lib/prisma");
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.sub },
    });

    res.json({
      success: true,
      data: subscription || { plan: "FREE", status: "active" },
    });
  } catch (err) {
    console.error("Get subscription error:", err);
    res.status(500).json({ success: false, error: "Failed to get subscription" });
  }
});

// ─── POST /api/payments/cancel ──────────────────────────────
router.post("/cancel", async (req: Request, res: Response) => {
  try {
    const { default: prisma } = await import("../lib/prisma");
    
    await prisma.subscription.updateMany({
      where: { userId: req.user!.sub },
      data: { cancelAtPeriodEnd: true },
    });

    res.json({ success: true, message: "Subscription will cancel at end of billing period" });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    res.status(500).json({ success: false, error: "Failed to cancel subscription" });
  }
});

export default router;
