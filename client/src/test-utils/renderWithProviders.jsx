import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userReducer from "@/state/user/userSlice";
import menuCategoriesReducer from "@/state/menu/menuCategoriesSlice";
import printMenuReducer from "@/state/printMenu/printMenuSlice";

export function renderWithProviders(
  ui,
  { preloadedState = {}, route = "/", ...renderOptions } = {},
) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      menuCategories: menuCategoriesReducer,
      printMenu: printMenuReducer,
    },
    preloadedState,
  });

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
