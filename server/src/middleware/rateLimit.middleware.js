const env = require("../config/env");
const { getTrafficForIpSince } = require("../services/traffic.service");

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const since = Date.now() - env.RATE_LIMIT_WINDOW_MS;
  const recentEvents = getTrafficForIpSince({ ip, since });

  if (recentEvents.length >= env.RATE_LIMIT_MAX) {
    return res.status(429).json({ message: "Rate limit exceeded." });
  }

  return next();
};

module.exports = rateLimitMiddleware;
