import { Worker, Job } from "bullmq";
import prisma from "../lib/prisma";
import redisConnection from "../lib/redis";

const cronWorker = new Worker(
  "cron",
  async (job: Job) => {
    switch (job.name) {
      case "midnight-processing":
        await executeMidnightProcessing();
        break;
      case "weekly-insights":
        await executeWeeklyInsightsProcessing();
        break;
    }
  },
  { connection: redisConnection }
);

import { syncUserBehaviorProfile } from "../services/behavior.service";

/**
 * Runs daily to re-calculate streaks and consequences
 */
async function executeMidnightProcessing() {
  console.log("[Cron] Executing midnight processing...");

  // 1. Mark pending past-due tasks as OVERDUE
  await prisma.task.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: new Date() }
    },
    data: { status: "OVERDUE" }
  });

  // 2. Break habit streaks for missed entries
  // (In a full impl, we'd find habits with lastLog < twoDaysAgo and reset currentStreak)

  // 3. Sync User Behavior Profiles (Discipline Score, Peak Hour, etc)
  const users = await prisma.user.findMany({ select: { id: true } });
  
  for (const user of users) {
    try {
      await syncUserBehaviorProfile(user.id);
    } catch (err) {
      console.error(`[Cron] Failed behavior sync for user ${user.id}:`, err);
    }
  }

  console.log("[Cron] Midnight processing complete");
}

import { generateWeeklyInsights } from "../services/ai.service";
import { sendPushNotification } from "../services/fcm.service";

async function executeWeeklyInsightsProcessing() {
  console.log("[Cron] Generating weekly insights... (Batch processing)");
  
  // 1. Fetch only users with PRO or PREMIUM plans who were active recently
  const premiumUsers = await prisma.user.findMany({
    where: {
      subscription: {
        plan: { in: ["PRO", "PREMIUM"] },
        status: "active",
      },
    },
    select: { id: true, email: true },
  });

  for (const user of premiumUsers) {
    try {
      // 2. Generate insights using Gemini
      const insights = await generateWeeklyInsights(user.id);
      
      // 3. Create a notification record in DB
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Your Weekly Life Retro is Ready",
          message: insights[0]?.title || "We've analyzed your week. See your patterns now.",
          type: "SYSTEM",
          metadata: { insights },
        },
      });

      // 4. Send push notification if token exists
      const fcmToken = await prisma.fCMToken.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (fcmToken) {
        await sendPushNotification(fcmToken.token, {
          title: "📊 Weekly Insight Ready",
          body: insights[0]?.title || "Check your productivity trends from last week.",
        });
      }

      console.log(`[Cron] Insight sent to user ${user.id}`);
    } catch (err) {
      console.error(`[Cron] Failed to generate weekly insight for ${user.id}:`, err);
    }
  }

  console.log(`[Cron] Weekly insights processing complete for ${premiumUsers.length} users`);
}

cronWorker.on("failed", (job, err) => {
  console.error(`[Cron Worker] Job ${job?.id} failed:`, err.message);
});

export default cronWorker;
