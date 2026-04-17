import { Queue } from "bullmq";
import redisConnection from "../lib/redis";

// ─── QUEUE DEFINITIONS ──────────────────────────────────────

// Reminders for tasks, habits, and bills
export const reminderQueue = new Queue("reminders", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
  },
});

// Periodic cron jobs (e.g. daily summaries, streak calculation)
export const cronQueue = new Queue("cron", {
  connection: redisConnection,
  defaultJobOptions: { removeOnComplete: true },
});

// ─── HELPER FUNCTIONS ───────────────────────────────────────

/**
 * Schedule a task reminder
 */
export async function scheduleTaskReminder(
  taskId: string,
  userId: string,
  scheduledTime: Date,
  minutesBeforeDue: number
) {
  const delay = Math.max(0, scheduledTime.getTime() - Date.now());

  await reminderQueue.add(
    "task-reminder",
    { taskId, userId, minutesBeforeDue },
    { delay, jobId: `task-rem-${taskId}-${minutesBeforeDue}` }
  );
}

/**
 * Remove a previously scheduled task reminder
 */
export async function cancelTaskReminder(taskId: string, minutesBeforeDue: number) {
  const jobId = `task-rem-${taskId}-${minutesBeforeDue}`;
  const job = await reminderQueue.getJob(jobId);
  if (job) {
    await job.remove();
  }
}

/**
 * Initialize recurring background tasks
 */
export async function initializeCronJobs() {
  // Midnight UTC — calculate streaks and daily limits
  await cronQueue.add("midnight-processing", {}, {
    repeat: { pattern: "0 0 * * *" },
    jobId: "cron-midnight"
  });

  // Monday 8 AM UTC — Weekly insights generation
  await cronQueue.add("weekly-insights", {}, {
    repeat: { pattern: "0 8 * * 1" },
    jobId: "cron-weekly-insights"
  });

  console.log("⏱️ BullMQ Cron jobs initialized");
}
