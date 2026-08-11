// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import Signup from "../Signup";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";

vi.mock("@/utils/baseUrl", () => ({
  default: { post: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function fillRequiredFields(container) {
  fireEvent.change(container.querySelector('input[pattern="[A-Za-z]+"]'), {
    target: { value: "MyRestaurant" },
  });
  fireEvent.change(container.querySelector('input[type="email"]'), {
    target: { value: "owner@example.com" },
  });
  fireEvent.change(container.querySelector('input[type="password"]'), {
    target: { value: "secret123" },
  });
  fireEvent.change(container.querySelector('input[type="tel"]'), {
    target: { value: "0500000000" },
  });
  const restaurantNameInput = container.querySelector(
    'input[pattern="[A-Za-z]+"]',
  );
  const displayNameInput = Array.from(
    container.querySelectorAll("input:not([type])"),
  ).find((el) => el !== restaurantNameInput);
  fireEvent.change(displayNameInput, { target: { value: "המסעדה שלי" } });
}

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the signup form", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByText("יצירת חשבון")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הירשם" })).toBeInTheDocument();
  });

  it("blocks submission and shows a toast when terms are not agreed to", async () => {
    const { container } = renderWithProviders(<Signup />);
    fillRequiredFields(container);
    fireEvent.click(screen.getByRole("button", { name: "הירשם" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "חובה לאשר את התקנון כדי ליצור חשבון",
      ),
    );
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("submits the form and shows a success toast once terms are agreed to", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      status: 201,
      data: { user: { _id: "u1" }, token: "tok123" },
    });

    const { container } = renderWithProviders(<Signup />);
    fillRequiredFields(container);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "הירשם" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/auth/signup",
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  });
});
