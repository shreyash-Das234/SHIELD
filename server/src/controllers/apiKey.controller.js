const {
  createApiKey,
  listApiKeys,
  revokeApiKey
} = require("../services/apiKey.service");

const getApiKeys = (req, res) => {
  res.json({ apiKeys: listApiKeys(req.user.id) });
};

const generateApiKey = (req, res) => {
  const apiKey = createApiKey({
    userId: req.user.id,
    name: req.body.name || "Primary Key"
  });

  res.status(201).json({
    message: "API key generated successfully.",
    apiKey
  });
};

const deleteApiKey = (req, res) => {
  const revoked = revokeApiKey({ userId: req.user.id, id: req.params.id });

  if (!revoked) {
    return res.status(404).json({ message: "API key not found." });
  }

  return res.json({ message: "API key revoked.", apiKey: revoked });
};

module.exports = {
  getApiKeys,
  generateApiKey,
  deleteApiKey
};
