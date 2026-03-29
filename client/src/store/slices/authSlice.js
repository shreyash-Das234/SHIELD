import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("shield_user")) || null,
  token: localStorage.getItem("shield_token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("shield_user");
      localStorage.removeItem("shield_token");
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;