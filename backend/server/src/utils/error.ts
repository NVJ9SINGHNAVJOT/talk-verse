import { logger } from "@/logger/logger";
import { Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errRes(
  res: Response,
  status: number,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: unknown
): Response<unknown, Record<string, unknown>> {
  // log internal server error
  if (error && error instanceof Error) {
    logger.error(message, {
      status: status,
      error: {
        name: error.name,
        mesage: error.message,
        stack: error.stack || "unknown",
        cause: error.cause || "unknown",
      },
    });
  } else {
    logger.error(message, { status: status });
  }

  return res.status(status).json({
    success: false,
    message: message,
  });
}
