// LifeAdmin AI — Shared Types
// These types are used across web frontend, mobile app, and backend

// ─── ENUMS ─────────────────────────────────────────────────

export enum PlanTier {
  FREE = "FREE",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
}

export enum TaskCategory {
  FINANCE = "FINANCE",
  HEALTH = "HEALTH",
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  EDUCATION = "EDUCATION",
  SOCIAL = "SOCIAL",
  HOME = "HOME",
  OTHER = "OTHER",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
  OVERDUE = "OVERDUE",
}

export enum FinanceType {
  BILL = "BILL",
  SUBSCRIPTION = "SUBSCRIPTION",
  LOAN_EMI = "LOAN_EMI",
  INSURANCE = "INSURANCE",
  INVESTMENT = "INVESTMENT",
  INCOME = "INCOME",
  CUSTOM = "CUSTOM",
}

// ─── USER TYPES ────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  timezone: string;
  locale: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onboardingDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── TASK TYPES ────────────────────────────────────────────

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  priorityScore: number;
  status: TaskStatus;
  dueDate?: string | null;
  completedAt?: string | null;
  isRecurring: boolean;
  recurrenceRule?: string | null;
  parentTaskId?: string | null;
  consequenceText?: string | null;
  consequenceAmount?: number | null;
  aiParsed: boolean;
  rawInput?: string | null;
  tags: string[];
  reminderMinutes: number[];
  snoozedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedTask {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  priorityScore: number;
  dueDate: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  consequenceText: string | null;
  consequenceAmount: number | null;
  reminderMinutes: number[];
  tags: string[];
}

// ─── HABIT TYPES ───────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  category: TaskCategory;
  frequency: string;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  isActive: boolean;
  color: string;
  icon: string;
  reminderTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  loggedAt: string;
  note?: string | null;
}

// ─── FINANCE TYPES ─────────────────────────────────────────

export interface FinancialItem {
  id: string;
  userId: string;
  name: string;
  type: FinanceType;
  amount: number;
  currency: string;
  dueDay?: number | null;
  dueDate?: string | null;
  isRecurring: boolean;
  recurrenceRule?: string | null;
  isAutoPay: boolean;
  lateFeeAmount?: number | null;
  lateFeeAfterDays?: number | null;
  reminderDaysBefore: number[];
  notes?: string | null;
  isPaid: boolean;
  lastPaidAt?: string | null;
  createdAt: string;
}

// ─── GOAL TYPES ────────────────────────────────────────────

export interface Milestone {
  title: string;
  completed: boolean;
  date?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: TaskCategory;
  targetDate: string;
  progressPercent: number;
  milestones: Milestone[];
  aiPlan?: any;
  isActive: boolean;
  createdAt: string;
}

// ─── NOTIFICATION TYPES ────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "reminder" | "system" | "payment" | "insight";
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// ─── ANALYTICS TYPES ───────────────────────────────────────

export interface DashboardStats {
  todayTasks: number;
  completedToday: number;
  overdueTasks: number;
  upcomingThisWeek: number;
  disciplineScore: number;
  habitStreaks: { name: string; current: number; target: number; icon: string }[];
  financeAlerts: { name: string; dueIn: number; amount: number; lateFee?: number }[];
}

export interface WeeklyInsight {
  type: "warning" | "tip" | "praise";
  title: string;
  body: string;
  action: string;
}

export interface BehaviorProfile {
  avgCompletionRate: number;
  peakProductivityHour: number;
  weeklyCompletionMap: Record<string, number>;
  commonDelayPatterns: any;
  disciplineScore: number;
  lastAnalyzedAt: string;
}

// ─── SUBSCRIPTION TYPES ────────────────────────────────────

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string | null;
}

// ─── API TYPES ─────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
