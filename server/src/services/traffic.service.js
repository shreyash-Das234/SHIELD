const TrafficModel = require("../models/traffic.model");
const store = require("../cache/store");
const env = require("../config/env");

const recordTraffic = (payload) => {
  const event = new TrafficModel(payload);
  store.trafficEvents.unshift(event);
  store.trafficEvents.splice(env.TRAFFIC_RETENTION_LIMIT);
  return event;
};

const getTraffic = () => store.trafficEvents;

const getDashboardStats = () => {
  const blocked = store.trafficEvents.filter((item) => item.status === "blocked").length;
  const suspicious = store.trafficEvents.filter((item) => item.riskScore >= 60).length;

  return {
    totalRequests: store.trafficEvents.length,
    blockedRequests: blocked,
    suspiciousRequests: suspicious,
    activeBlocks: store.blockedIps.length
  };
};

const getTrafficForIpSince = ({ ip, since }) =>
  store.trafficEvents.filter(
    (event) => event.ip === ip && new Date(event.createdAt).getTime() >= since
  );

module.exports = {
  recordTraffic,
  getTraffic,
  getDashboardStats,
  getTrafficForIpSince
};
