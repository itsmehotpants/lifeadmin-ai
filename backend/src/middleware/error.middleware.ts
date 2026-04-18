import { Sentry } from "../lib/sentry";

/**
 * Centralized error handling middleware
 * Handles Zod validation, Prisma, and generic errors
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Capture only non-client errors in Sentry (optional preference)
  if (!(err instanceof ZodError) && (err as any).statusCode !== 401 && (err as any).statusCode !== 403) {
    Sentry.captureException(err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation error",
      code: "VALIDATION_ERROR",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field";
      res.status(409).json({
        success: false,
        error: `A record with this ${target} already exists`,
        code: "DUPLICATE_ENTRY",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        error: "Record not found",
        code: "NOT_FOUND",
      });
      return;
    }
  }

  // Generic errors
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    code: "INTERNAL_ERROR",
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    code: "NOT_FOUND",
  });
};
