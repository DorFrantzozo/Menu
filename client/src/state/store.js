import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import categoryReducer from "./menu/menuCategoriesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    menuCategories: categoryReducer,
  },
});

export default store;
