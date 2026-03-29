const { listBlockedIps } = require("../services/mitigation.service");
const store = require("../cache/store");

const getMitigationOverview = (_req, res) => {
  res.json({
    blockedIps: listBlockedIps(),
    alerts: store.alerts.slice(0, 25)
  });
};

module.exports = { getMitigationOverview };
