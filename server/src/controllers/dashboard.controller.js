const { getDashboardStats, getTraffic } = require("../services/traffic.service");
const store = require("../cache/store");

const getDashboard = (_req, res) => {
  res.json({
    stats: getDashboardStats(),
    recentTraffic: getTraffic().slice(0, 10),
    alerts: store.alerts.slice(0, 10)
  });
};

module.exports = { getDashboard };
