import { createSlice } from "@reduxjs/toolkit";

const loadCategoriesFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("categories")) || [];
  } catch (error) {
    console.error("Error loading categories from localStorage:", error);
    return [];
  }
};

const saveCategoriesToStorage = (categories) => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

const initialState = {
  menuCategories: loadCategoriesFromStorage(),
};

const categorySlice = createSlice({
  name: "menuCategories",
  initialState,
  reducers: {
    setMenuCategories: (state, action) => {
      if (
        JSON.stringify(state.menuCategories) !== JSON.stringify(action.payload)
      ) {
        state.menuCategories = action.payload;
        saveCategoriesToStorage(state.menuCategories);
      }
    },
    logoutMenuCategories: (state) => {
      state.menuCategories = [];
      localStorage.removeItem("categories");
    },
    updateMenuCategories: (state, action) => {
      const updatedCategories = action.payload.map((category) => ({
        ...category,
        menuDishes: category.menuDishes || [],
      }));

      if (
        JSON.stringify(state.menuCategories) !==
        JSON.stringify(updatedCategories)
      ) {
        state.menuCategories = updatedCategories;
        saveCategoriesToStorage(state.menuCategories);
      }
    },
    addMenuDishesToCategory: (state, action) => {
      const { categoryId, dishes } = action.payload;
      console.log(`Adding dishes to category ${categoryId}:`, dishes);

      const categoryIndex = state.menuCategories.findIndex(
        (cat) => cat._id === categoryId
      );
      if (categoryIndex !== -1) {
        state.menuCategories[categoryIndex].menuDishes = dishes;
        console.log(`Updated category ${categoryId} with dishes:`, dishes);
        saveCategoriesToStorage(state.menuCategories);
      } else {
        console.warn(`Category ${categoryId} not found!`);
      }
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
