const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  WEBSOCKET_URL: import.meta.env.VITE_WS_URL || "ws://localhost:5000",
  APP_NAME: "SHIELD",
  REQUEST_LIMIT: 100,
};

export default config;