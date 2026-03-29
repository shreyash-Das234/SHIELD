import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import trafficReducer from "./slices/trafficSlice";
import attackReducer from "./slices/attackSlice";
import apiKeyReducer from "./slices/apiKeySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    traffic: trafficReducer,
    attacks: attackReducer,
    apiKeys: apiKeyReducer,
  },
});

export default store;