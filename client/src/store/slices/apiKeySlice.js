import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keys: [],
};

const apiKeySlice = createSlice({
  name: "apiKeys",
  initialState,
  reducers: {
    setKeys: (state, action) => {
      state.keys = action.payload;
    },
    addKey: (state, action) => {
      state.keys.push(action.payload);
    },
    removeKey: (state, action) => {
      state.keys = state.keys.filter((key) => key.id !== action.payload);
    },
  },
});

export const { setKeys, addKey, removeKey } = apiKeySlice.actions;
export default apiKeySlice.reducer;