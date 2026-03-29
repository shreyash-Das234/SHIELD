const { createFingerprint } = require("../security/fingerprinting");
const { evaluateThreat } = require("../services/detection.service");
const { recordTraffic, getTrafficForIpSince } = require("../services/traffic.service");
const { blockIp } = require("../services/mitigation.service");
const store = require("../cache/store");

const trafficCaptureMiddleware = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("user-agent") || "";
    const recentTraffic = getTrafficForIpSince({
      ip,
      since: Date.now() - 60_000
    });

    const threat = evaluateThreat({
      requestCount: recentTraffic.length + 1,
      userAgent,
      path: req.originalUrl
    });

    const entry = recordTraffic({
      ip,
      method: req.method,
      path: req.originalUrl,
      userAgent,
      status: res.statusCode >= 400 ? "flagged" : "allowed",
      apiKeyId: req.apiKey?.id || null,
      riskScore: threat.riskScore,
      threatLevel: threat.threatLevel,
      fingerprint: createFingerprint({
        ip,
        userAgent,
        acceptLanguage: req.get("accept-language")
      }),
      latencyMs: Date.now() - startedAt
    });

    if (threat.shouldBlock) {
      const blocked = blockIp({
        ip,
        reason: `Automated mitigation: ${threat.reasons.join(", ")}`
      });

      store.alerts.unshift({
        id: blocked.id,
        type: "auto-block",
        ip,
        reasons: threat.reasons,
        createdAt: new Date().toISOString()
      });
      store.alerts.splice(50);
      entry.status = "blocked";
    }
  });

  next();
};

module.exports = trafficCaptureMiddleware;
