// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

expect.extend(matchers);
afterEach(() => cleanup());

import PrintMenuButton from "../PrintMenuButton";
import printMenuReducer from "@/state/printMenu/printMenuSlice";

vi.mock("@/utils/qrGenerator", () => ({
  generateQRCode: vi.fn().mockResolvedValue("data:image/png;base64,QR"),
}));
vi.mock("../PrintMenuModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="print-menu-modal">
      <button onClick={onClose}>close-modal</button>
    </div>
  ),
}));
vi.mock("../PrintMenuPreview", () => ({
  default: () => <div data-testid="print-menu-preview" />,
}));

function renderButton(props) {
  const store = configureStore({ reducer: { printMenu: printMenuReducer } });
  return render(
    <Provider store={store}>
      <PrintMenuButton {...props} />
    </Provider>,
  );
}

describe("PrintMenuButton", () => {
  it("is disabled when there is no menu content", () => {
    renderButton({
      user: {},
      menuCategories: [{ _id: "c1", menuDishes: [] }],
    });
    expect(screen.getByRole("button", { name: /הדפס תפריט/ })).toBeDisabled();
  });

  it("is enabled and opens the print modal when there are dishes", () => {
    renderButton({
      user: {},
      menuCategories: [{ _id: "c1", menuDishes: [{ _id: "d1" }] }],
    });
    const button = screen.getByRole("button", { name: /הדפס תפריט/ });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(screen.getByTestId("print-menu-modal")).toBeInTheDocument();
  });
});
