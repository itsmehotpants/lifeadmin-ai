import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma";

const BCRYPT_ROUNDS = 12;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token (15 min) and refresh token (30 days)
 */
export function generateTokenPair(userId: string, email: string, plan: string): TokenPair {
  const accessToken = jwt.sign(
    { sub: userId, email, plan },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  return { accessToken, refreshToken };
}

/**
 * Store refresh token in database for later validation/revocation
 */
export async function storeRefreshToken(
  userId: string,
  token: string,
  deviceId?: string
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await prisma.refreshToken.create({
    data: {
      userId,
      token: hashToken(token), // Store hashed for security
      expiresAt,
      deviceId,
    },
  });
}

/**
 * Validate and consume a refresh token (rotation: old token deleted, new one issued)
 */
export async function rotateRefreshToken(
  oldToken: string
): Promise<{ userId: string; email: string; plan: string } | null> {
  const hashedToken = hashToken(oldToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: {
      user: {
        include: { subscription: true },
      },
    },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    // Token not found or expired — possible token reuse attack
    if (storedToken) {
      // Delete all refresh tokens for this user (security measure)
      await prisma.refreshToken.deleteMany({
        where: { userId: storedToken.userId },
      });
    }
    return null;
  }

  // Delete the used token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  return {
    userId: storedToken.userId,
    email: storedToken.user.email,
    plan: storedToken.user.subscription?.plan || "FREE",
  };
}

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 */
export async function revokeAllTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate email verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token for secure storage
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Get user with subscription plan info
 */
export async function getUserWithPlan(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
}
