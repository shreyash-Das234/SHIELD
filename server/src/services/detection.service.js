const { evaluateAnomalyRules } = require("../security/anomalyRules");
const { detectBot } = require("../security/botDetection");

const evaluateThreat = ({ requestCount, userAgent, path }) => {
  const anomaly = evaluateAnomalyRules({ requestCount, userAgent, path });
  const bot = detectBot(userAgent);

  let riskScore = anomaly.score;
  const reasons = [...anomaly.reasons];

  if (bot.isBot) {
    riskScore += 35;
    reasons.push(`bot-signature:${bot.signature}`);
  }

  let threatLevel = "low";
  if (riskScore >= 80) {
    threatLevel = "critical";
  } else if (riskScore >= 60) {
    threatLevel = "high";
  } else if (riskScore >= 30) {
    threatLevel = "medium";
  }

  return {
    riskScore,
    threatLevel,
    reasons,
    shouldBlock: riskScore >= 85
  };
};

module.exports = { evaluateThreat };
