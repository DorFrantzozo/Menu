// @vitest-environment jsdom
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

vi.mock("../../../utils/baseUrl", () => ({
  default: { put: vi.fn(), patch: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import axiosInstance from "../../../utils/baseUrl";
import EditUserModal from "../EditUserModal";

const baseUser = {
  _id: "u1",
  restaurantName: "MyRestaurant",
  plan: "iMenu PRO",
  trialExpiresAt: new Date(2030, 2, 20),
  nextPaymentDate: new Date(2099, 0, 31), // 31 Jan 2099
};

const renderModal = (overrides = {}) => {
  const onSave = vi.fn();
  const onClose = vi.fn();
  render(
    <EditUserModal
      isOpen
      onClose={onClose}
      user={{ ...baseUser, ...overrides }}
      onSave={onSave}
    />,
  );
  return { onSave, onClose };
};

describe("EditUserModal — renewal panel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("escapes the table cell it is triggered from", () => {
    // AdminUserRow renders this modal inside <td class="... text-right">, so
    // without a portal the whole dialog inherits that alignment and is subject
    // to the stacking context of the table.
    render(
      <table>
        <tbody>
          <tr>
            <td className="text-right">
              <EditUserModal
                isOpen
                onClose={vi.fn()}
                user={baseUser}
                onSave={vi.fn()}
              />
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const dialog = screen.getByText("Edit User Subscription").closest("[dir]");
    expect(dialog).toHaveAttribute("dir", "ltr");
    expect(dialog.closest("td")).toBeNull();
    expect(dialog.parentElement).toBe(document.body);
  });

  it("shows when the subscription ends and how long is left", () => {
    const inTenDays = new Date();
    inTenDays.setDate(inTenDays.getDate() + 10);
    renderModal({ nextPaymentDate: inTenDays });

    expect(screen.getByText("Subscription ends")).toBeInTheDocument();
    expect(screen.getByText(/10 days left/)).toBeInTheDocument();
  });

  it("flags a lapsed subscription and extends from today instead", () => {
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    renderModal({ nextPaymentDate: lastMonth });

    expect(screen.getByText(/Expired 30 days ago/)).toBeInTheDocument();
    expect(screen.getByText("(today)")).toBeInTheDocument();
  });

  it("previews the renewed date with month-end clamping", () => {
    renderModal();
    // 31 Jan + 1 month has no 31st to land on, so it clamps to 28 Feb.
    expect(screen.getByText("28/02/2099")).toBeInTheDocument();
  });

  it("sends the selected number of months to the renewal endpoint", async () => {
    axiosInstance.patch.mockResolvedValue({
      data: {
        nextPaymentDate: new Date(2099, 3, 30),
        lastBilledDate: new Date(),
        isPaid: true,
        subscriptionStatus: "active",
      },
    });

    const { onSave } = renderModal();

    // [0] is the plan select, [1] is the renewal-length select.
    const [, monthsSelect] = screen.getAllByRole("combobox");
    fireEvent.change(monthsSelect, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /renew/i }));

    await waitFor(() => expect(axiosInstance.patch).toHaveBeenCalled());
    expect(axiosInstance.patch).toHaveBeenCalledWith(
      "/admin/users/u1/renew-subscription",
      { months: 3 },
    );
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("does not renew when the confirmation is declined", async () => {
    window.confirm.mockReturnValue(false);
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /renew/i }));

    expect(axiosInstance.patch).not.toHaveBeenCalled();
  });

  it("disables renewal for a Free user", () => {
    renderModal({ plan: "Free" });

    expect(screen.getByRole("button", { name: /renew/i })).toBeDisabled();
    expect(
      screen.getByText(/no subscription to renew/i),
    ).toBeInTheDocument();
  });

  it("keeps Save on its own endpoint, untouched by renewal", async () => {
    axiosInstance.put.mockResolvedValue({
      data: {
        plan: "iMenu PRO",
        trialExpiresAt: baseUser.trialExpiresAt,
        isPaid: true,
        subscriptionStatus: "active",
      },
    });

    renderModal();
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(axiosInstance.put).toHaveBeenCalled());
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/admin/users/u1",
      expect.objectContaining({ plan: "iMenu PRO" }),
    );
    expect(axiosInstance.patch).not.toHaveBeenCalled();
  });
});
