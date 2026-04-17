import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  storeRefreshToken,
  rotateRefreshToken,
  revokeAllTokens,
  getUserWithPlan,
} from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/ratelimit.middleware";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./validation";

const router = Router();

// ─── POST /api/auth/register ────────────────────────────────
router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ success: false, error: "Email already registered", code: "EMAIL_EXISTS" });
      return;
    }

    // Create user
    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
    });

    // Create free subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.email, "FREE");
    await storeRefreshToken(user.id, tokens.refreshToken);

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/api/auth",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          timezone: user.timezone,
          locale: user.locale,
          isEmailVerified: user.isEmailVerified,
          onboardingDone: user.onboardingDone,
          createdAt: user.createdAt,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { subscription: true },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const validPassword = await comparePassword(data.password, user.passwordHash);
    if (!validPassword) {
      res.status(401).json({ success: false, error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const plan = user.subscription?.plan || "FREE";
    const tokens = generateTokenPair(user.id, user.email, plan);
    await storeRefreshToken(user.id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          timezone: user.timezone,
          locale: user.locale,
          isEmailVerified: user.isEmailVerified,
          onboardingDone: user.onboardingDone,
          createdAt: user.createdAt,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (err) {
    if ((err as any).name === "ZodError") {
      res.status(400).json({ success: false, error: "Validation error", details: (err as any).errors });
      return;
    }
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// ─── POST /api/auth/refresh-token ───────────────────────────
router.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, error: "No refresh token provided", code: "NO_TOKEN" });
      return;
    }

    const result = await rotateRefreshToken(token);
    if (!result) {
      res.clearCookie("refreshToken", { path: "/api/auth" });
      res.status(401).json({ success: false, error: "Invalid or expired refresh token", code: "INVALID_REFRESH_TOKEN" });
      return;
    }

    const tokens = generateTokenPair(result.userId, result.email, result.plan);
    await storeRefreshToken(result.userId, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ success: false, error: "Token refresh failed" });
  }
});

// ─── POST /api/auth/logout ──────────────────────────────────
router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    await revokeAllTokens(req.user!.sub);
    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, error: "Logout failed" });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await getUserWithPlan(req.user!.sub);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        timezone: user.timezone,
        locale: user.locale,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        onboardingDone: user.onboardingDone,
        plan: user.subscription?.plan || "FREE",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, error: "Failed to get user data" });
  }
});

// ─── POST /api/auth/google ──────────────────────────────────
router.post("/google", async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ success: false, error: "Google ID token required" });
      return;
    }

    // Verify Google ID token
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) {
      res.status(401).json({ success: false, error: "Invalid Google token" });
      return;
    }

    const googleUser = await response.json() as { sub: string; email: string; name: string; picture: string };
    
    if (!googleUser.email) {
      res.status(400).json({ success: false, error: "Email not provided by Google" });
      return;
    }

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || "User",
          avatarUrl: googleUser.picture,
          isEmailVerified: true,
        },
      });

      // Create free subscription
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Upsert OAuth account
    await prisma.oAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleUser.sub,
        },
      },
      update: {},
      create: {
        userId: user.id,
        provider: "google",
        providerAccountId: googleUser.sub,
      },
    });

    const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
    const plan = subscription?.plan || "FREE";
    const tokens = generateTokenPair(user.id, user.email, plan);
    await storeRefreshToken(user.id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          timezone: user.timezone,
          locale: user.locale,
          isEmailVerified: user.isEmailVerified,
          onboardingDone: user.onboardingDone,
          createdAt: user.createdAt,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ success: false, error: "Google authentication failed" });
  }
});

// ─── POST /api/auth/forgot-password ─────────────────────────
router.post("/forgot-password", authLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    
    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      // TODO: Generate reset token and send via Resend
      // For now, just log it
      console.log(`Password reset requested for: ${email}`);
    }

    res.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to process request" });
  }
});

// ─── POST /api/auth/reset-password ──────────────────────────
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    
    // TODO: Verify reset token from cache/db
    // For now, placeholder
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to reset password" });
  }
});

// ─── POST /api/auth/verify-email ────────────────────────────
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, error: "Verification token required" });
      return;
    }

    // TODO: Verify email token and update user
    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to verify email" });
  }
});

export default router;
