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
      localStorage.setItem("categories", JSON.stringify(state.menuCategories));
    },
    logoutMenuCategories: (state) => {
      state.menuCategories = [];
      localStorage.removeItem("categories");
    },
    updateMenuCategories: (state, action) => {
      state.menuCategories = action.payload.map((category) => ({
        ...category,
        menuDishes: category.menuDishes || [], // אם אין מנות, יוצרים מערך ריק
      }));
      localStorage.removeItem("categories");
      localStorage.setItem("categories", JSON.stringify(state.menuCategories));
    },
    addMenuDishesToCategory: (state, action) => {
      const { categoryId, dishes } = action.payload;
      console.log(`Adding dishes to category ${categoryId}:`, dishes);
      const category = state.menuCategories.find(
        (cat) => cat._id === categoryId
      );
      if (category) {
        category.menuDishes = dishes;
        console.log(
          `Updated category ${categoryId} with dishes:`,
          category.menuDishes
        );
      }
      localStorage.setItem("categories", JSON.stringify(state.menuCategories));
    },
  },
});

export const {
  setMenuCategories,
  logoutMenuCategories,
  updateMenuCategories,
  addMenuDishesToCategory,
} = categorySlice.actions;
export default categorySlice.reducer;
