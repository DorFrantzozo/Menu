import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    signupUser: (state, action) => {
      state.user = action.payload;
      console.log(state.user);
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, signupUser, logoutUser, setToken } = userSlice.actions;
export default userSlice.reducer;
