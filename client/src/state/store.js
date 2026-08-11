import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import categoryReducer from "./menu/menuCategoriesSlice";
import printMenuReducer from "./printMenu/printMenuSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    menuCategories: categoryReducer,
    printMenu: printMenuReducer,
  },
});

export default store;
