import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  traffic: [],
  stats: null,
  geo: [],
  loading: false,
};

const trafficSlice = createSlice({
  name: "traffic",
  initialState,
  reducers: {
    setTraffic: (state, action) => {
      state.traffic = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setGeo: (state, action) => {
      state.geo = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTraffic, setStats, setGeo, setLoading } = trafficSlice.actions;
export default trafficSlice.reducer;