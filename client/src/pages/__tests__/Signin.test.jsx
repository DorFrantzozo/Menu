// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import Signin from "../Signin";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";
import {
  getCategories,
  getAllDishesAndMapToCategories,
} from "@/utils/fetchData";

vi.mock("@/utils/baseUrl", () => ({
  default: { post: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/utils/fetchData", () => ({
  getCategories: vi.fn(),
  getAllDishesAndMapToCategories: vi.fn(),
}));

describe("Signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    renderWithProviders(<Signin />);
    expect(screen.getByText("התחברות לחשבון")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "התחבר" })).toBeInTheDocument();
  });

  it("logs in successfully, stores the user, and shows a success toast", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      status: 200,
      data: { user: { _id: "u1" }, token: "tok123", expireTime: "later" },
    });
    getCategories.mockResolvedValueOnce([]);
    getAllDishesAndMapToCategories.mockResolvedValueOnce([]);

    const { store, container } = renderWithProviders(<Signin />);
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "owner@example.com" },
    });
    fireEvent.change(container.querySelector('input[type="password"]'), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "התחבר" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(store.getState().user.user).toEqual({ _id: "u1" });
  });

  it("shows an error toast on invalid credentials", async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error("invalid"));
    const { container } = renderWithProviders(<Signin />);
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "owner@example.com" },
    });
    fireEvent.change(container.querySelector('input[type="password"]'), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "התחבר" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "שם המשתמש או הסיסמה אינם תקינים",
      ),
    );
  });

  it("does not crash when the forgot-password link is clicked", () => {
    renderWithProviders(<Signin />);
    expect(() =>
      fireEvent.click(screen.getByText("שכחתי סיסמה")),
    ).not.toThrow();
  });
});
