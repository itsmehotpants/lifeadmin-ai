import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { createFamilySchema, joinFamilySchema } from "./validation";
const router = Router();

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── POST /api/family/create ────────────────────────────────
router.post("/create", authenticate, async (req: Request, res: Response) => {
  try {
    const { name } = createFamilySchema.parse(req.body);
    const userId = req.user!.sub;

    // Check if user already owns a family
    const existing = await prisma.family.findUnique({ where: { ownerId: userId } });
    if (existing) {
      res.status(400).json({ success: false, error: "You already own a family group." });
      return;
    }

    const inviteCode = generateInviteCode();

    const family = await prisma.family.create({
      data: {
        name,
        ownerId: userId,
        inviteCode,
        members: {
          create: {
            userId,
            role: "owner",
          },
        },
      },
      include: { members: true },
    });

    res.status(201).json({ success: true, data: family });
  } catch (err) {
    console.error("Family create error:", err);
    res.status(500).json({ success: false, error: "Failed to create family" });
  }
});

// ─── POST /api/family/join ──────────────────────────────────
router.post("/join", authenticate, async (req: Request, res: Response) => {
  try {
    const { inviteCode } = joinFamilySchema.parse(req.body);
    const userId = req.user!.sub;

    const family = await prisma.family.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
    });

    if (!family) {
      res.status(404).json({ success: false, error: "Invalid invite code" });
      return;
    }

    // Check if already a member
    const existingMember = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: family.id, userId } },
    });

    if (existingMember) {
      res.status(400).json({ success: false, error: "You are already a member of this family" });
      return;
    }

    const member = await prisma.familyMember.create({
      data: {
        familyId: family.id,
        userId,
        role: "member",
      },
    });

    res.json({ success: true, data: member, familyName: family.name });
  } catch (err) {
    console.error("Family join error:", err);
    res.status(500).json({ success: false, error: "Failed to join family" });
  }
});

// ─── GET /api/family/members ────────────────────────────────
router.get("/members", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;

    // Find the family the user belongs to
    const memberRecord = await prisma.familyMember.findFirst({
      where: { userId },
      include: {
        family: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!memberRecord) {
      res.json({ success: true, data: [], message: "Not a member of any family" });
      return;
    }

    res.json({ success: true, data: memberRecord.family });
  } catch (err) {
    console.error("Fetch members error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch family members" });
  }
});

export default router;
