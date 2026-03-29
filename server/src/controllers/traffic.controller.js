const { getTraffic } = require("../services/traffic.service");
const { listBlockedIps } = require("../services/mitigation.service");

const getTrafficLogs = (_req, res) => {
  res.json({ traffic: getTraffic() });
};

const getBlockedIps = (_req, res) => {
  res.json({ blockedIps: listBlockedIps() });
};

module.exports = {
  getTrafficLogs,
  getBlockedIps
};
