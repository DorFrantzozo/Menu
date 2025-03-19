import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dishes: JSON.parse(localStorage.getItem("dishes")) || [],
};

const dishSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setDishes: (state, action) => { 
      state.dishes = action.payload;
      localStorage.setItem("dishes", JSON.stringify(action.payload));
    },
    logoutDishes: (state) => {
      state.dishes = [];
      localStorage.removeItem("dishes");
    },
    updateDishes: (state, action) => {
      state.dishes = action.payload;
      localStorage.removeItem("dishes");
      localStorage.setItem("dishes", JSON.stringify(action.payload));
    },
  },
});

export const { setDishes, logoutDishes, updateDishes } = dishSlice.actions;
export default dishSlice.reducer;
