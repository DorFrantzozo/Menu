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
      
      const safeKeys = ['theme', 'darkMode', 'language', 'i18nextLng', 'adminTheme'];
      
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && !safeKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {setUser, signupUser, logoutUser, setToken, updateUser} =
  userSlice.actions;
export default userSlice.reducer;
