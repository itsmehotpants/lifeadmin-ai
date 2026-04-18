// LifeAdmin AI — Zod Validation Schemas (shared across frontend + backend)

import { z } from "zod";

// ─── AUTH SCHEMAS ──────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// ─── TASK SCHEMAS ──────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["FINANCE", "HEALTH", "WORK", "PERSONAL", "EDUCATION", "SOCIAL", "HOME", "OTHER"]).default("OTHER"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  priorityScore: z.number().min(0).max(100).default(50),
  dueDate: z.string().datetime().optional().nullable(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional().nullable(),
  consequenceText: z.string().max(500).optional().nullable(),
  consequenceAmount: z.number().optional().nullable(),
  tags: z.array(z.string()).default([]),
  reminderMinutes: z.array(z.number().int().positive()).default([]),
});

export const updateTaskSchema = createTaskSchema.partial();

export const parseTaskSchema = z.object({
  input: z.string().min(3, "Input too short").max(500),
});

export const snoozeTaskSchema = z.object({
  snoozedUntil: z.string().datetime(),
});

// ─── HABIT SCHEMAS ─────────────────────────────────────────

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["FINANCE", "HEALTH", "WORK", "PERSONAL", "EDUCATION", "SOCIAL", "HOME", "OTHER"]).default("HEALTH"),
  frequency: z.string().min(1, "Frequency is required"), // "daily" | "weekly:3" | "weekdays"
  targetCount: z.number().int().min(1).default(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").default("#6366f1"),
  icon: z.string().default("🎯"),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)").optional().nullable(),
});

export const updateHabitSchema = createHabitSchema.partial();

export const logHabitSchema = z.object({
  note: z.string().max(500).optional(),
});

// ─── FINANCE SCHEMAS ───────────────────────────────────────

export const createFinancialItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: z.enum(["BILL", "SUBSCRIPTION", "LOAN_EMI", "INSURANCE", "INVESTMENT", "INCOME", "CUSTOM"]),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  dueDay: z.number().int().min(1).max(31).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  isRecurring: z.boolean().default(true),
  recurrenceRule: z.string().optional().nullable(),
  isAutoPay: z.boolean().default(false),
  lateFeeAmount: z.number().optional().nullable(),
  lateFeeAfterDays: z.number().int().optional().nullable(),
  reminderDaysBefore: z.array(z.number().int().positive()).default([7, 3, 1]),
  notes: z.string().max(1000).optional(),
});

export const updateFinancialItemSchema = createFinancialItemSchema.partial();

// ─── GOAL SCHEMAS ──────────────────────────────────────────

export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["FINANCE", "HEALTH", "WORK", "PERSONAL", "EDUCATION", "SOCIAL", "HOME", "OTHER"]),
  targetDate: z.string().datetime(),
  milestones: z.array(z.object({
    title: z.string(),
    completed: z.boolean().default(false),
    date: z.string().optional(),
  })).default([]),
});

export const updateGoalSchema = createGoalSchema.partial();

export const updateProgressSchema = z.object({
  progressPercent: z.number().min(0).max(100),
});

// ─── NOTIFICATION SCHEMAS ──────────────────────────────────

export const registerFCMTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
  platform: z.enum(["android", "ios", "web"]),
});

// ─── FAMILY SCHEMAS ──────────────────────────────────────────

export const createFamilySchema = z.object({
  name: z.string().min(1, "Family name is required").max(100),
});

export const joinFamilySchema = z.object({
  inviteCode: z.string().min(6, "Invalid invite code").max(10),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ParseTaskInput = z.infer<typeof parseTaskSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CreateFinancialItemInput = z.infer<typeof createFinancialItemSchema>;
export type UpdateFinancialItemInput = z.infer<typeof updateFinancialItemSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type JoinFamilyInput = z.infer<typeof joinFamilySchema>;
