const { randomUUID } = require("uuid");

class ApiKeyModel {
  constructor({ userId, key, name = "Default Key" }) {
    this.id = randomUUID();
    this.userId = userId;
    this.key = key;
    this.name = name;
    this.active = true;
    this.createdAt = new Date().toISOString();
    this.lastUsedAt = null;
  }
}

module.exports = ApiKeyModel;
