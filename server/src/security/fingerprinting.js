const createFingerprint = ({ ip, userAgent, acceptLanguage = "" }) =>
  [ip || "unknown-ip", userAgent || "unknown-agent", acceptLanguage || "unknown-lang"].join("::");

module.exports = { createFingerprint };
