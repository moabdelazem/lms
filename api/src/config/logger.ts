import pino from "pino";
import config from "./config";

const logger = pino({
  level: config.nodeEnv === "development" ? "debug" : config.logLevel,
  transport:
    config.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  redact: ["req.headers.authorization", "password", "token"],
});

export default logger;
