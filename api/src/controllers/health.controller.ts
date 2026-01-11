import { Request, Response } from "express";
import prisma from "../config/database";
import logger from "../config/logger";

const startTime = Date.now();

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
  });
};

export const readyCheck = async (_req: Request, res: Response): Promise<void> => {
  const checks: Record<string, { status: string; responseTime?: number }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: "up",
      responseTime: Date.now() - dbStart,
    };
  } catch (err) {
    logger.error({ err }, "Database health check failed");
    checks.database = {
      status: "down",
      responseTime: Date.now() - dbStart,
    };
  }

  const isReady = Object.values(checks).every((c) => c.status === "up");

  res.status(isReady ? 200 : 503).json({
    status: isReady ? "ready" : "not ready",
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  });
};
