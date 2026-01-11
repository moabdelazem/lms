import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import logger from "../config/logger";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existingId = req.headers["x-correlation-id"];
    if (existingId && typeof existingId === "string") {
      return existingId;
    }
    return randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 400) {
      return "warn";
    }
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, _res, err) => {
    return `${req.method} ${req.url} failed: ${err.message}`;
  },
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "duration",
  },
});
