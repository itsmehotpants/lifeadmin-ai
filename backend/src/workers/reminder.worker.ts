import { Worker, Job } from "bullmq";
import prisma from "../lib/prisma";
import redisConnection from "../lib/redis";
import { generateSmartReminderMessage } from "../services/ai.service";
import { sendPushNotification } from "../services/fcm.service";

// ─── REMINDER WORKER ────────────────────────────────────────

const reminderWorker = new Worker(
  "reminders",
  async (job: Job) => {
    switch (job.name) {
      case "task-reminder":
        await handleTaskReminder(job.data);
        break;
      case "bill-reminder":
        // implement future logic
        break;
      default:
        console.warn(`Unknown reminder job type: ${job.name}`);
    }
  },
  { connection: redisConnection }
);

async function handleTaskReminder(data: { taskId: string; userId: string; minutesBeforeDue: number }) {
  const { taskId, userId, minutesBeforeDue } = data;

  const task = await prisma.task.findUnique({
    where: { id: taskId, status: "PENDING" },
    include: {
      user: {
        include: { FCMToken: true }
      }
    }
  });

  // If task is completed/deleted or user has no FCM tokens, skip
  if (!task || !task.user.FCMToken.length) return;

  const hoursUntilDue = task.dueDate
    ? Math.max(0, Math.round((task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60)))
    : minutesBeforeDue / 60;

  // 1. Generate context-aware AI message
  const aiMessage = await generateSmartReminderMessage(
    { title: task.title, category: task.category, consequenceText: task.consequenceText },
    hoursUntilDue
  );

  // 2. Broadcast to all user devices
  const pushPromises = task.user.FCMToken.map((device) =>
    sendPushNotification(device.token, "Task Reminder", aiMessage, {
      type: "task",
      taskId: task.id,
      url: `/dashboard/tasks`,
    })
  );

  await Promise.allSettled(pushPromises);
  console.log(`[Worker] Executed task reminder for ${task.title}`);
}

reminderWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

export default reminderWorker;
