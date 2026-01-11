import app from "./app";
import config from "./config/config";
import logger from "./config/logger";
import { setupGracefulShutdown } from "./utils/shutdown";

const server = app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, "Server started");
});

setupGracefulShutdown(server);
