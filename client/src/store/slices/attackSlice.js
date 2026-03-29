import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attacks: [],
};

const attackSlice = createSlice({
  name: "attacks",
  initialState,
  reducers: {
    setAttacks: (state, action) => {
      state.attacks = action.payload;
    },
    addAttack: (state, action) => {
      state.attacks.unshift(action.payload);
    },
  },
});

export const { setAttacks, addAttack } = attackSlice.actions;
export default attackSlice.reducer;