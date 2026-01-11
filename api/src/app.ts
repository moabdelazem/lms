import express from "express";
import cors from "cors";
import config from "./config/config";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";

const app = express();

// Request logging
app.use(requestLogger);

// CORS
const corsOrigins = config.cors.origins;
app.use(
  cors({
    origin: corsOrigins.length === 1 && corsOrigins[0] === "*" ? "*" : corsOrigins,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-correlation-id"],
  })
);

// Body parsing
app.use(express.json());

// Health endpoints (outside /api for Kubernetes probes)
app.use(healthRoutes);

// API routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
