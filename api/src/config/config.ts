import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  shutdownTimeout: number;
  logLevel: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  shutdownTimeout: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10000,
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;