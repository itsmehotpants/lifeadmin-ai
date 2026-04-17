import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export interface AuthPayload {
  sub: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies access token from Authorization header
 * Differentiates between expired and invalid tokens
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized", code: "NO_TOKEN" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        error: "Invalid token",
        code: "INVALID_TOKEN",
      });
      return;
    }
    res.status(401).json({ success: false, error: "Authentication failed" });
  }
};

/**
 * Optional authentication — sets req.user if token exists but doesn't block
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      req.user = payload;
    } catch {
      // Silent fail for optional auth
    }
  }
  next();
};
