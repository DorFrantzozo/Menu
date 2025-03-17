import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuCategories: JSON.parse(localStorage.getItem("categories")) || [],
};

const categorySlice = createSlice({
  name: "menuCategories",
  initialState,
  reducers: {
    setMenuCategories: (state, action) => {
      state.menuCategories = action.payload;
      localStorage.setItem("categories", JSON.stringify(action.payload));
    },
    logoutMenuCategories: (state) => {
      state.menuCategories = [];
      localStorage.removeItem("categories");
    },
    updateMenuCategories: (state, action) => {
      state.menuCategories = action.payload;
      localStorage.removeItem("categories");
      localStorage.setItem("categories", JSON.stringify(action.payload));
      console.log(action.payload);
    },
  },
});

export const { setMenuCategories, logoutMenuCategories, updateMenuCategories } =
  categorySlice.actions;
export default categorySlice.reducer;
