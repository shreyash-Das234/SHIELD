import api from "./api";

// Get all traffic logs
export const getTrafficData = async () => {
  const response = await api.get("/traffic");
  return response.data;
};

// Get attack logs
export const getAttackLogs = async () => {
  const response = await api.get("/traffic/attacks");
  return response.data;
};

// Get dashboard summary
export const getDashboardStats = async () => {
  const response = await api.get("/traffic/stats");
  return response.data;
};

// Get geo traffic
export const getGeoTraffic = async () => {
  const response = await api.get("/traffic/geo");
  return response.data;
};