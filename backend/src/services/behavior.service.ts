import prisma from "../lib/prisma";

export async function syncUserBehaviorProfile(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [tasks, habitLogs, habits, currentProfile] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["COMPLETED", "OVERDUE", "PENDING"] },
      },
      select: {
        status: true,
        category: true,
        dueDate: true,
        completedAt: true,
        priorityScore: true,
      },
    }),
    prisma.habitLog.findMany({
      where: {
        userId,
        loggedAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.habit.findMany({
      where: { userId, isActive: true },
    }),
    prisma.behaviorProfile.findUnique({ where: { userId } }),
  ]);

  // 1. Calculate Completion Rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const avgCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // 2. Identify Peak Productivity Hour
  const completionHours = tasks
    .filter((t) => t.status === "COMPLETED" && t.completedAt)
    .map((t) => new Date(t.completedAt!).getHours());
  
  const hourCounts: Record<number, number> = {};
  completionHours.forEach((h) => (hourCounts[h] = (hourCounts[h] || 0) + 1));
  const peakProductivityHour = Object.keys(hourCounts).length > 0 
    ? parseInt(Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b))
    : 10;

  // 3. Discipline Score Calculation
  // Base 50, +1 per on-time completion, -2 per overdue, +5 per current habit streak
  let disciplineScore = 50;
  
  tasks.forEach(t => {
    if (t.status === "COMPLETED") {
       if (t.dueDate && t.completedAt && t.completedAt <= t.dueDate) {
         disciplineScore += 1;
       } else if (t.dueDate && t.completedAt && t.completedAt > t.dueDate) {
         disciplineScore -= 0.5;
       }
    } else if (t.status === "OVERDUE") {
      disciplineScore -= 2;
    }
  });

  habits.forEach(h => {
    disciplineScore += (h.currentStreak * 0.5);
  });

  // Clamp 0-100
  disciplineScore = Math.max(0, Math.min(100, Math.round(disciplineScore)));

  // 4. Delay Patterns (Categories with most Overdue/Late items)
  const delayMap: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.status === "OVERDUE" || (t.dueDate && t.completedAt && t.completedAt > t.dueDate)) {
      delayMap[t.category] = (delayMap[t.category] || 0) + 1;
    }
  });

  // 5. Weekly Completion Map
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyCompletion: Record<string, number> = {};
  days.forEach(d => weeklyCompletion[d] = 0);
  
  tasks.filter(t => t.status === "COMPLETED" && t.completedAt).forEach(t => {
    const dayName = days[new Date(t.completedAt!).getDay()];
    weeklyCompletion[dayName]++;
  });

  // 6. Persist
  return prisma.behaviorProfile.upsert({
    where: { userId },
    update: {
      avgCompletionRate,
      peakProductivityHour,
      disciplineScore,
      weeklyCompletionMap: weeklyCompletion as any,
      commonDelayPatterns: delayMap as any,
      lastAnalyzedAt: new Date(),
    },
    create: {
      userId,
      avgCompletionRate,
      peakProductivityHour,
      disciplineScore,
      weeklyCompletionMap: weeklyCompletion as any,
      commonDelayPatterns: delayMap as any,
    },
  });
}
