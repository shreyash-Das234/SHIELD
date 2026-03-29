const evaluateAnomalyRules = ({ requestCount = 0, userAgent = "", path = "" }) => {
  let score = 0;
  const reasons = [];

  if (requestCount > 60) {
    score += 45;
    reasons.push("burst-traffic");
  }

  if (!userAgent || userAgent.length < 6) {
    score += 20;
    reasons.push("weak-user-agent");
  }

  if (path.includes("admin") || path.includes("wp-login")) {
    score += 25;
    reasons.push("suspicious-path");
  }

  return { score, reasons };
};

module.exports = { evaluateAnomalyRules };
