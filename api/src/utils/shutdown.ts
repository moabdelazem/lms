import { Server } from "http";
import prisma from "../config/database";
import logger from "../config/logger";
import config from "../config/config";

let isShuttingDown = false;

export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      logger.warn("Shutdown already in progress");
      return;
    }

    isShuttingDown = true;
    logger.info({ signal }, "Received shutdown signal, starting graceful shutdown");

    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "Error closing HTTP server");
        process.exit(1);
      }

      logger.info("HTTP server closed, no longer accepting connections");

      try {
        // Disconnect Prisma client
        await prisma.$disconnect();
        logger.info("Database connection closed");

        logger.info("Graceful shutdown completed");
        process.exit(0);
      } catch (disconnectErr) {
        logger.error({ err: disconnectErr }, "Error during database disconnect");
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      logger.error("Shutdown timeout exceeded, forcing exit");
      process.exit(1);
    }, config.shutdownTimeout);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  logger.info("Graceful shutdown handlers registered");
}
