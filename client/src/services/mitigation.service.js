import api from "./api";

// Get blocked IPs
export const getBlockedIPs = async () => {
  const response = await api.get("/mitigation/blocked");
  return response.data;
};

// Block an IP manually
export const blockIP = async (ipData) => {
  const response = await api.post("/mitigation/block", ipData);
  return response.data;
};

// Unblock IP
export const unblockIP = async (ip) => {
  const response = await api.post("/mitigation/unblock", { ip });
  return response.data;
};

// Get mitigation logs
export const getMitigationLogs = async () => {
  const response = await api.get("/mitigation/logs");
  return response.data;
};