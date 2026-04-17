import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../lib/prisma";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Reuse model instance — JSON mode for deterministic parsing
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1,
  },
});

// Text model for short messages (no JSON needed)
const textModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
  },
});

/**
 * Parse a natural language input into a structured task using Gemini AI
 */
export async function parseTaskFromNaturalLanguage(input: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });

  const prompt = `
You are a personal life management AI. Parse the following natural language input into a structured task.

User input: "${input}"
User timezone: ${user?.timezone || "Asia/Kolkata"}
Current date: ${new Date().toISOString()}

Return ONLY a JSON object (no explanation, no markdown) with these fields:
{
  "title": "Clean task title",
  "category": "FINANCE|HEALTH|WORK|PERSONAL|EDUCATION|SOCIAL|HOME|OTHER",
  "priority": "LOW|MEDIUM|HIGH|CRITICAL",
  "priorityScore": 0-100,
  "dueDate": "ISO 8601 string or null",
  "isRecurring": boolean,
  "recurrenceRule": "RRULE string or null",
  "consequenceText": "What happens if missed, or null",
  "consequenceAmount": number or null,
  "reminderMinutes": [array of integers: minutes before due date],
  "tags": ["tag1", "tag2"]
}

Example:
Input: "Pay electricity bill every month on 15th"
Output: { "title": "Pay Electricity Bill", "category": "FINANCE", "priority": "HIGH", "priorityScore": 80, "dueDate": "2025-02-15T00:00:00.000Z", "isRecurring": true, "recurrenceRule": "FREQ=MONTHLY;BYMONTHDAY=15", "consequenceText": "Late payment may incur penalty fee", "consequenceAmount": null, "reminderMinutes": [1440, 60], "tags": ["bill", "utility"] }
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error("AI parse error:", err);
    // Fallback: return basic parsed task
    return {
      title: input,
      category: "OTHER",
      priority: "MEDIUM",
      priorityScore: 50,
      dueDate: null,
      isRecurring: false,
      recurrenceRule: null,
      consequenceText: null,
      consequenceAmount: null,
      reminderMinutes: [60],
      tags: [],
    };
  }
}

/**
 * Generate a context-aware smart reminder message
 */
export async function generateSmartReminderMessage(
  task: { title: string; category: string; consequenceText?: string | null },
  hoursUntilDue: number
) {
  const urgency = hoursUntilDue < 2 ? "URGENT" : hoursUntilDue < 24 ? "TODAY" : "UPCOMING";

  const prompt = `
Generate a short, actionable push notification reminder message.
Task: ${task.title}
Category: ${task.category}
Due: ${hoursUntilDue} hours from now
Consequence: ${task.consequenceText || "none"}
Urgency: ${urgency}

Rules:
- Max 80 characters total
- Include consequence if available
- Be direct and conversational, not generic
- Use ₹ for Indian money amounts
- Return ONLY the message string, no quotes, no explanation
`;

  try {
    const result = await textModel.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch (err) {
    console.error("AI reminder error:", err);
    return `Reminder: ${task.title} is due soon`;
  }
}

/**
 * Generate weekly productivity insights using AI
 */
export async function generateWeeklyInsights(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalTasks, completedTasks, tasksByCategory, habitsBroken, financeMissed] =
    await Promise.all([
      prisma.task.count({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.task.count({
        where: { userId, status: "COMPLETED", completedAt: { gte: sevenDaysAgo } },
      }),
      prisma.task.groupBy({
        by: ["category"],
        where: {
          userId,
          status: { in: ["PENDING", "OVERDUE"] },
          dueDate: { gte: sevenDaysAgo, lt: new Date() },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.habit.count({
        where: { userId, currentStreak: 0, isActive: true },
      }),
      prisma.financialItem.count({
        where: {
          userId,
          isPaid: false,
          dueDate: { gte: sevenDaysAgo, lt: new Date() },
        },
      }),
    ]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const mostMissedCategory = tasksByCategory[0]?.category || "None";

  const prompt = `
Analyze this user's weekly productivity data and give 3 specific, actionable insights.

Data:
- Completion rate: ${completionRate}%
- Tasks completed: ${completedTasks}/${totalTasks}
- Most missed category: ${mostMissedCategory}
- Habit streaks broken: ${habitsBroken}
- Finance items missed: ${financeMissed}

Return ONLY a JSON array of exactly 3 insights (no markdown, no explanation):
[{ "type": "warning|tip|praise", "title": "short title max 6 words", "body": "2 sentence insight", "action": "specific next step" }]
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error("AI insights error:", err);
    return [
      {
        type: "tip",
        title: "Keep building momentum",
        body: `You completed ${completedTasks} tasks this week. Try to beat that next week!`,
        action: "Set 3 priority tasks for tomorrow",
      },
    ];
  }
}

/**
 * Check if a day is overloaded and suggest rescheduling
 */
export async function checkWorkloadBalance(userId: string, targetDate: string) {
  const date = new Date(targetDate);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const tasksOnDate = await prisma.task.findMany({
    where: {
      userId,
      status: { in: ["PENDING", "IN_PROGRESS"] },
      dueDate: { gte: startOfDay, lte: endOfDay },
    },
    orderBy: { priorityScore: "asc" },
  });

  const totalScore = tasksOnDate.reduce((sum, t) => sum + t.priorityScore, 0);

  if (totalScore > 300) {
    const reschedulable = tasksOnDate
      .filter((t) => t.priority === "LOW" || t.priority === "MEDIUM")
      .slice(0, 3);

    const suggestions = reschedulable.map((t) => ({
      taskId: t.id,
      title: t.title,
      currentPriority: t.priority,
      suggestedAction: "Move to a lighter day",
    }));

    return { isOverloaded: true, overloadScore: totalScore, taskCount: tasksOnDate.length, suggestions };
  }

  return { isOverloaded: false, overloadScore: totalScore, taskCount: tasksOnDate.length };
}
