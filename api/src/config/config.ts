import dotenv from "dotenv";

dotenv.config({quiet: true});

interface CorsConfig {
  origins: string[];
  credentials: boolean;
}

interface Config {
  port: number;
  nodeEnv: string;
  shutdownTimeout: number;
  logLevel: string;
  databaseUrl: string;
  cors: CorsConfig;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  shutdownTimeout: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10000,
  logLevel: process.env.LOG_LEVEL || "info",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
  cors: {
    origins: process.env.CORS_ORIGINS?.split(",") || ["*"],
    credentials: process.env.CORS_CREDENTIALS === "true",
  },
};

export default config;