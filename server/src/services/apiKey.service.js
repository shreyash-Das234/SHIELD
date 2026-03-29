const crypto = require("crypto");
const ApiKeyModel = require("../models/apiKey.model");
const store = require("../cache/store");
const env = require("../config/env");

const generateApiKeyValue = () =>
  `${env.API_KEY_PREFIX}_${crypto.randomBytes(18).toString("hex")}`;

const createApiKey = ({ userId, name }) => {
  const apiKey = new ApiKeyModel({
    userId,
    name,
    key: generateApiKeyValue()
  });

  store.apiKeys.push(apiKey);
  return apiKey;
};

const listApiKeys = (userId) => store.apiKeys.filter((apiKey) => apiKey.userId === userId);

const findApiKey = (rawKey) => store.apiKeys.find((apiKey) => apiKey.key === rawKey && apiKey.active);

const revokeApiKey = ({ userId, id }) => {
  const apiKey = store.apiKeys.find((item) => item.id === id && item.userId === userId);

  if (!apiKey) {
    return null;
  }

  apiKey.active = false;
  return apiKey;
};

const markApiKeyUsed = (apiKeyId) => {
  const apiKey = store.apiKeys.find((item) => item.id === apiKeyId);

  if (apiKey) {
    apiKey.lastUsedAt = new Date().toISOString();
  }

  return apiKey;
};

module.exports = {
  createApiKey,
  listApiKeys,
  findApiKey,
  revokeApiKey,
  markApiKeyUsed
};
