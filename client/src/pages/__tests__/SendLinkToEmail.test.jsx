// @vitest-environment jsdom
import React from "react";
import { screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

import SendLinkToEmail from "../SendLinkToEmail";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { SendLinkToEmail as sendLinkToEmailApi } from "@/utils/updateData";

vi.mock("@/components/nav/NavBarLanding", () => ({
  default: () => <div data-testid="nav-bar-landing" />,
}));
vi.mock("@/utils/updateData", () => ({
  SendLinkToEmail: vi.fn(),
}));

describe("SendLinkToEmail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the nav bar and the reset-link form", () => {
    renderWithProviders(<SendLinkToEmail />);
    expect(screen.getByTestId("nav-bar-landing")).toBeInTheDocument();
    expect(screen.getByText("איפוס סיסמה")).toBeInTheDocument();
  });

  it("submits the entered email to request a reset link", async () => {
    const { container } = renderWithProviders(<SendLinkToEmail />);
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "owner@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(sendLinkToEmailApi).toHaveBeenCalledWith("owner@example.com"),
    );
  });
});
