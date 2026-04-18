import * as Sentry from "@sentry/node";
import "@sentry/tracing";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn("Sentry DSN not found. Skipping Sentry initialization.");
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || "development",
  });

  console.log("Sentry monitoring initialized.");
}

export { Sentry };
