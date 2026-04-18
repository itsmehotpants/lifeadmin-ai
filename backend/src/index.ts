import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { generalLimiter } from "./middleware/ratelimit.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// Route imports
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import habitsRoutes from "./routes/habits.routes";
import financeRoutes from "./routes/finance.routes";
import goalsRoutes from "./routes/goals.routes";
import analyticsRoutes from "./routes/analytics.routes";
import notificationsRoutes from "./routes/notifications.routes";
import paymentsRoutes from "./routes/payments.routes";
import aiRoutes from "./routes/ai.routes";

import { initSentry, Sentry } from "./lib/sentry";

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry Monitoring
initSentry();

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────────
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);

// ─── HEALTH CHECK ───────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "LifeAdmin AI API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API ROUTES ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/ai", aiRoutes);

// ─── ERROR HANDLING ─────────────────────────────────────────
// The Sentry error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(notFoundHandler);
app.use(errorHandler);

import { startWorkers } from "./workers";

// ─── START SERVER ───────────────────────────────────────────
(async () => {
  try {
    // Start BullMQ workers
    await startWorkers();

    app.listen(PORT, () => {
      console.log(`
      ╔═══════════════════════════════════════════════╗
      ║         LifeAdmin AI — API Server             ║
      ║─────────────────────────────────────────────────║
      ║  🚀 Running on: http://localhost:${PORT}          ║
      ║  📡 Environment: ${process.env.NODE_ENV || "development"}              ║
      ║  🕐 Started at: ${new Date().toLocaleTimeString()}                ║
      ╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

export default app;
