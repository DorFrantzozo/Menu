// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import ManageDishes from "../ManageDishes";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

vi.mock("@/components/DishComponents/DishFilters", () => ({
  default: () => <div data-testid="dish-filters" />,
}));
vi.mock("@/components/DishComponents/DishList", () => ({
  default: ({ dishes }) => (
    <div data-testid="dish-list">{dishes.length} dishes</div>
  ),
}));
vi.mock("@/components/DishComponents/AddDishForm", () => ({
  default: ({ closeModal }) => (
    <div data-testid="add-dish-form">
      <button onClick={closeModal}>close</button>
    </div>
  ),
}));
vi.mock("@/components/DishComponents/EditDishForm", () => ({
  default: () => <div data-testid="edit-dish-form" />,
}));

const category = {
  _id: "cat1",
  name: "מנות עיקריות",
  menuDishes: [
    {
      _id: "d1",
      name: "פסטה",
      pregnant: false,
      gluten: true,
      lactose: false,
      vegi: false,
    },
    {
      _id: "d2",
      name: "סלט",
      pregnant: false,
      gluten: false,
      lactose: false,
      vegi: true,
    },
  ],
};

const basePreloadedState = {
  user: { user: { _id: "u1", email: "owner@example.com" } },
  menuCategories: { menuCategories: [category] },
};

describe("ManageDishes", () => {
  it("renders the page title and dishes grouped by category", () => {
    renderWithProviders(<ManageDishes />, {
      preloadedState: basePreloadedState,
    });
    expect(screen.getByText("מנות התפריט")).toBeInTheDocument();
    expect(screen.getByText(category.name)).toBeInTheDocument();
    expect(screen.getByTestId("dish-list")).toHaveTextContent("2 dishes");
  });

  it("shows the empty state when there are no categories", () => {
    renderWithProviders(<ManageDishes />, {
      preloadedState: {
        ...basePreloadedState,
        menuCategories: { menuCategories: [] },
      },
    });
    expect(screen.getByText("לא נמצאו מנות")).toBeInTheDocument();
  });

  it("toggles the add-dish form when the add button is clicked", () => {
    renderWithProviders(<ManageDishes />, {
      preloadedState: basePreloadedState,
    });
    expect(screen.queryByTestId("add-dish-form")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("הוסף מנה"));
    expect(screen.getByTestId("add-dish-form")).toBeInTheDocument();
  });

  // TODO: cover search/sensitivity filter interactions once DishFilters is tested in isolation
});
