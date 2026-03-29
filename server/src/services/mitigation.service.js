const BlockedIPModel = require("../models/blockedIP.model");
const store = require("../cache/store");
const env = require("../config/env");

const blockIp = ({ ip, reason, durationMs = env.BLOCK_DURATION_MS }) => {
  const existing = store.blockedIps.find((entry) => entry.ip === ip);
  const expiresAt = new Date(Date.now() + durationMs).toISOString();

  if (existing) {
    existing.reason = reason;
    existing.expiresAt = expiresAt;
    return existing;
  }

  const blocked = new BlockedIPModel({ ip, reason, expiresAt });
  store.blockedIps.push(blocked);
  return blocked;
};

const unblockExpiredIps = () => {
  const now = Date.now();

  for (let index = store.blockedIps.length - 1; index >= 0; index -= 1) {
    if (new Date(store.blockedIps[index].expiresAt).getTime() <= now) {
      store.blockedIps.splice(index, 1);
    }
  }
};

const isIpBlocked = (ip) => {
  unblockExpiredIps();
  return store.blockedIps.find((entry) => entry.ip === ip) || null;
};

const listBlockedIps = () => {
  unblockExpiredIps();
  return store.blockedIps;
};

module.exports = {
  blockIp,
  isIpBlocked,
  listBlockedIps,
  unblockExpiredIps
};
