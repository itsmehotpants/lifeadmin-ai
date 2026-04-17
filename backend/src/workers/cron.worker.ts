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

/**
 * Runs daily to re-calculate streaks and consequences
 */
async function executeMidnightProcessing() {
  console.log("[Cron] Executing midnight processing...");

  // Example: Reset completedToday flag on habits
  // Find all habits that were NOT logged today and break their streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(yesterday);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Mark pending past-due tasks as OVERDUE
  await prisma.task.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: new Date() }
    },
    data: { status: "OVERDUE" }
  });

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
