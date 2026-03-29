const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const logger = require("./logs/logger");
const authRoutes = require("./api/auth.routes");
const apiKeyRoutes = require("./api/apiKey.routes");
const trafficRoutes = require("./api/traffic.routes");
const dashboardRoutes = require("./api/dashboard.routes");
const ipBlockMiddleware = require("./middleware/ipBlock.middleware");
const rateLimitMiddleware = require("./middleware/rateLimit.middleware");
const trafficCaptureMiddleware = require("./middleware/trafficCapture.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(ipBlockMiddleware);
app.use(rateLimitMiddleware);
app.use(trafficCaptureMiddleware);

app.get("/health", (_req, res) => {
  res.json({
    service: "shield-server",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/apikeys", apiKeyRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  logger.error("Unhandled server error", { message: error.message, stack: error.stack });
  res.status(500).json({ message: "Internal server error." });
});

app.listen(env.PORT, () => {
  logger.info("SHIELD backend started", {
    port: env.PORT,
    env: env.NODE_ENV
  });
});
