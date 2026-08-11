// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import ManageCategories from "../ManageCategories";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

vi.mock("@/components/CateroryComponents/AddCategoryForm", () => ({
  default: ({ onCancel }) => (
    <div data-testid="add-category-form">
      <button onClick={onCancel}>cancel</button>
    </div>
  ),
}));
vi.mock("@/components/CateroryComponents/EditCategoryForm", () => ({
  default: () => <div data-testid="edit-category-form" />,
}));
vi.mock("@/components/CateroryComponents/SortableCategoryCard", () => ({
  default: ({ category }) => (
    <div data-testid="category-card">{category.name}</div>
  ),
}));
vi.mock("@/components/CateroryComponents/CategoryCard", () => ({
  default: () => <div data-testid="drag-overlay-card" />,
}));
vi.mock("@/components/CateroryComponents/CategoryDeleteModal", () => ({
  default: () => <div data-testid="category-delete-modal" />,
}));
vi.mock("@/hooks/useCategoryLogic", () => ({
  useCategoryLogic: () => ({
    categoryToDelete: null,
    setCategoryToDelete: vi.fn(),
    executeDelete: vi.fn(),
  }),
}));
vi.mock("@/hooks/useCategoryDnD", () => ({
  useCategoryDnD: () => ({
    sensors: [],
    activeId: null,
    handleDragStart: vi.fn(),
    handleDragCancel: vi.fn(),
    handleDragEnd: vi.fn(),
  }),
}));

const categories = [
  {
    _id: "cat1",
    name: "שעת שמח",
    locationNumber: 1,
    hasTimeLimit: true,
    startTime: "17:00",
    endTime: "19:00",
  },
  { _id: "cat2", name: "עיקריות", locationNumber: 2 },
];

const preloadedState = {
  user: { user: { _id: "u1" } },
  menuCategories: { menuCategories: categories },
};

describe("ManageCategories", () => {
  it("shows a loading skeleton when isLoading is true", () => {
    const { container } = renderWithProviders(
      <ManageCategories isLoading onCreate={vi.fn()} />,
      { preloadedState },
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders a card per category once loaded", () => {
    renderWithProviders(<ManageCategories isLoading={false} onCreate={vi.fn()} />, {
      preloadedState,
    });
    expect(screen.getByText("שעת שמח")).toBeInTheDocument();
    expect(screen.getByText("עיקריות")).toBeInTheDocument();
  });

  it("filters categories by search term", () => {
    renderWithProviders(<ManageCategories isLoading={false} onCreate={vi.fn()} />, {
      preloadedState,
    });
    fireEvent.change(screen.getByPlaceholderText("חפש קטגוריה ..."), {
      target: { value: "שמח" },
    });
    expect(screen.getByText("שעת שמח")).toBeInTheDocument();
    expect(screen.queryByText("עיקריות")).not.toBeInTheDocument();
  });

  it("shows the empty state when there are no categories", () => {
    renderWithProviders(<ManageCategories isLoading={false} onCreate={vi.fn()} />, {
      preloadedState: { ...preloadedState, menuCategories: { menuCategories: [] } },
    });
    expect(screen.getByText("לא נמצאה קטגוריה")).toBeInTheDocument();
  });

  it("opens the add-category form from the header button", () => {
    renderWithProviders(<ManageCategories isLoading={false} onCreate={vi.fn()} />, {
      preloadedState,
    });
    expect(screen.queryByTestId("add-category-form")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("הוסף קטגוריה"));
    expect(screen.getByTestId("add-category-form")).toBeInTheDocument();
  });
});
