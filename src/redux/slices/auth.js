import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authChecker: (state, action) => {
      state.isLogin = true
    },
    logOut: (state, action) => {
      state.isLogin = false;
      localStorage.removeItem("userId");
    },
  },
});

export const { authChecker, logOut } = authSlice.actions;
export default authSlice.reducer;
