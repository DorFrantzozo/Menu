import {createSlice} from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const userItem = localStorage.getItem("user");
    return userItem ? JSON.parse(userItem) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    signupUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.removeItem("user");
      console.log(action.payload);
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {setUser, signupUser, logoutUser, setToken, updateUser} =
  userSlice.actions;
export default userSlice.reducer;
