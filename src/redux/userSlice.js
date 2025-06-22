import { createSlice } from "@reduxjs/toolkit";

const userJson = localStorage.getItem("userAccount");
const initialState = {
  user: JSON.parse(userJson),
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUserAction, logoutUser } = userSlice.actions;

export default userSlice.reducer;
