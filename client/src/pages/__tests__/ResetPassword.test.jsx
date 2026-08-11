// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import ResetPassword from "../ResetPassword";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";

vi.mock("@/utils/baseUrl", () => ({
  default: { post: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an invalid-link message when no token is present in the URL", () => {
    renderWithProviders(<ResetPassword />, { route: "/request/resetpassword" });
    expect(screen.getByText("אופס! הקישור לא תקין")).toBeInTheDocument();
  });

  it("renders the reset form when a token is present", () => {
    renderWithProviders(<ResetPassword />, {
      route: "/request/resetpassword?token=abc123",
    });
    expect(screen.getByText("איפוס סיסמה")).toBeInTheDocument();
  });

  it("blocks submission when the passwords don't match", async () => {
    const { container } = renderWithProviders(<ResetPassword />, {
      route: "/request/resetpassword?token=abc123",
    });
    const [passwordInput, confirmInput] = container.querySelectorAll(
      'input[type="password"]',
    );
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.change(confirmInput, { target: { value: "different" } });
    fireEvent.click(screen.getByText("אפס סיסמה וצא לדרך"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("הסיסמאות אינן תואמות"),
    );
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("submits the new password and shows a success toast", async () => {
    axiosInstance.post.mockResolvedValueOnce({ status: 200 });
    const { container } = renderWithProviders(<ResetPassword />, {
      route: "/request/resetpassword?token=abc123",
    });
    const [passwordInput, confirmInput] = container.querySelectorAll(
      'input[type="password"]',
    );
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.change(confirmInput, { target: { value: "secret123" } });
    fireEvent.click(screen.getByText("אפס סיסמה וצא לדרך"));

    await waitFor(() =>
      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/resetPassword", {
        data: { token: "abc123", newPassword: "secret123" },
      }),
    );
    expect(toast.success).toHaveBeenCalled();
  });
});
