import api from "./api";

// Get all API keys
export const getApiKeys = async () => {
  const response = await api.get("/apikeys");
  return response.data;
};

// Generate new API key
export const generateApiKey = async () => {
  const response = await api.post("/apikeys/generate");
  return response.data;
};

// Revoke API key
export const revokeApiKey = async (id) => {
  const response = await api.delete(`/apikeys/${id}`);
  return response.data;
};