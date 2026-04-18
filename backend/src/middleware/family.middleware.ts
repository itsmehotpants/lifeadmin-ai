import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      familyId?: string | null;
    }
  }
}

/**
 * Middleware to fetch and attach familyId to the request object
 * Prerequisite: translate/authenticate middleware must have run
 */
export const attachFamilyId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next();
    return;
  }

  try {
    const member = await prisma.familyMember.findFirst({
      where: { userId: req.user.sub },
      select: { familyId: true },
    });

    req.familyId = member?.familyId || null;
    next();
  } catch (err) {
    console.error("AttachFamilyId error:", err);
    next();
  }
};
