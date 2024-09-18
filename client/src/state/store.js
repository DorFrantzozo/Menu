import { configureStore } from "@reduxjs/toolkit";
import userRducer from "./user/userSlice";

const store = configureStore({
  reducer: {
    user: userRducer,
  },
});

export default store;
