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

async function executeWeeklyInsightsProcessing() {
  console.log("[Cron] Generating weekly insights... (Batch processing)");
  // Iterate users with PREM/PRO and generate weekly insights -> trigger email/push.
}

cronWorker.on("failed", (job, err) => {
  console.error(`[Cron Worker] Job ${job?.id} failed:`, err.message);
});

export default cronWorker;
