const { findApiKey, markApiKeyUsed } = require("../services/apiKey.service");

const apiKeyMiddleware = (req, res, next) => {
  const rawKey = req.headers["x-api-key"];

  if (!rawKey) {
    return res.status(401).json({ message: "Missing x-api-key header." });
  }

  const apiKey = findApiKey(rawKey);
  if (!apiKey) {
    return res.status(401).json({ message: "Invalid API key." });
  }

  markApiKeyUsed(apiKey.id);
  req.apiKey = apiKey;
  return next();
};

module.exports = apiKeyMiddleware;
