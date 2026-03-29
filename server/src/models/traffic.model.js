const { randomUUID } = require("uuid");

class TrafficModel {
  constructor({
    ip,
    method,
    path,
    userAgent,
    status = "allowed",
    apiKeyId = null,
    riskScore = 0,
    threatLevel = "low",
    fingerprint = null,
    latencyMs = null
  }) {
    this.id = randomUUID();
    this.ip = ip;
    this.method = method;
    this.path = path;
    this.userAgent = userAgent;
    this.status = status;
    this.apiKeyId = apiKeyId;
    this.riskScore = riskScore;
    this.threatLevel = threatLevel;
    this.fingerprint = fingerprint;
    this.latencyMs = latencyMs;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = TrafficModel;
