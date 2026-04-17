import reminderWorker from "./reminder.worker";
import cronWorker from "./cron.worker";
import { initializeCronJobs } from "../services/queue.service";

export async function startWorkers() {
  console.log("🏗️ Initializing Background Workers...");

  // Register workers
  reminderWorker.on("ready", () => console.log("✅ Reminder Worker is ready"));
  cronWorker.on("ready", () => console.log("✅ Cron Worker is ready"));

  // Bootstrap scheduled repetitive tasks
  await initializeCronJobs();
}

/**
 * Handle graceful shutdown
 */
export async function stopWorkers() {
  console.log("Shutting down workers safely...");
  await Promise.all([reminderWorker.close(), cronWorker.close()]);
}
