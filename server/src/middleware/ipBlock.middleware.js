const { isIpBlocked } = require("../services/mitigation.service");

const ipBlockMiddleware = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const blocked = isIpBlocked(ip);

  if (blocked) {
    return res.status(403).json({
      message: "IP address is temporarily blocked.",
      blocked
    });
  }

  return next();
};

module.exports = ipBlockMiddleware;
