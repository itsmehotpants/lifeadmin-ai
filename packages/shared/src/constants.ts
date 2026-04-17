// LifeAdmin AI — Shared Constants

export const APP_NAME = "LifeAdmin AI";
export const APP_TAGLINE = "The operating system for your personal life";

// Plan limits
export const PLAN_LIMITS = {
  FREE: {
    maxTasks: 20,
    aiParsing: false,
    contextReminders: false,
    behaviorAnalytics: false,
    consequenceEngine: false,
    goalPlanning: false,
    familySharing: false,
    whatsappIntegration: false,
    maxFamilyMembers: 0,
  },
  PRO: {
    maxTasks: Infinity,
    aiParsing: true,
    contextReminders: true,
    behaviorAnalytics: true,
    consequenceEngine: false,
    goalPlanning: false,
    familySharing: false,
    whatsappIntegration: false,
    maxFamilyMembers: 0,
  },
  PREMIUM: {
    maxTasks: Infinity,
    aiParsing: true,
    contextReminders: true,
    behaviorAnalytics: true,
    consequenceEngine: true,
    goalPlanning: true,
    familySharing: true,
    whatsappIntegration: true,
    maxFamilyMembers: 5,
  },
} as const;

// Pricing
export const PRICING = {
  PRO: {
    monthly: { INR: 199, USD: 4.99 },
    annual: { INR: 1999, USD: 49.99 },
  },
  PREMIUM: {
    monthly: { INR: 499, USD: 9.99 },
    annual: { INR: 4999, USD: 99.99 },
  },
} as const;

// Task category colors
export const CATEGORY_COLORS: Record<string, string> = {
  FINANCE: "#f59e0b",
  HEALTH: "#10b981",
  WORK: "#6366f1",
  PERSONAL: "#ec4899",
  EDUCATION: "#8b5cf6",
  SOCIAL: "#14b8a6",
  HOME: "#f97316",
  OTHER: "#64748b",
};

// Task category icons
export const CATEGORY_ICONS: Record<string, string> = {
  FINANCE: "💰",
  HEALTH: "💪",
  WORK: "💼",
  PERSONAL: "🏠",
  EDUCATION: "📚",
  SOCIAL: "👥",
  HOME: "🏡",
  OTHER: "📋",
};

// Priority colors
export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#64748b",
  MEDIUM: "#3b82f6",
  HIGH: "#f59e0b",
  CRITICAL: "#ef4444",
};

// Behavior thresholds
export const OVERLOAD_THRESHOLD = 300;
export const EMERGENCY_CRITICAL_COUNT = 3;
export const DISCIPLINE_SCORE_MAX = 100;
