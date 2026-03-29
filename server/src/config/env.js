const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: true });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  JWT_SECRET: process.env.JWT_SECRET || "shield-dev-secret",
  API_KEY_PREFIX: process.env.API_KEY_PREFIX || "sk_shield",
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 120),
  TRAFFIC_RETENTION_LIMIT: Number(process.env.TRAFFIC_RETENTION_LIMIT || 500),
  BLOCK_DURATION_MS: Number(process.env.BLOCK_DURATION_MS || 15 * 60 * 1000),
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || "http://127.0.0.1:8000/predict"
};
