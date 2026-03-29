const { randomUUID } = require("uuid");

class BlockedIPModel {
  constructor({ ip, reason, expiresAt }) {
    this.id = randomUUID();
    this.ip = ip;
    this.reason = reason;
    this.expiresAt = expiresAt;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = BlockedIPModel;
