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

import QRCodeManager from "../QRCodeManager";
import {
  generateQRCode,
  downloadQRCode,
} from "@/utils/qrGenerator";

vi.mock("@/utils/qrGenerator", () => ({
  generateQRCode: vi.fn(),
  downloadQRCode: vi.fn(),
  shareQRCode: vi.fn(),
}));
vi.mock("../../data/DefaultDropDown", () => ({
  default: ({ handelSelectedProp }) => (
    <button onClick={() => handelSelectedProp("שחור עם רקע לבן")}>
      change-color
    </button>
  ),
}));

describe("QRCodeManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when there is no qrSlug", () => {
    const { container } = render(<QRCodeManager qrSlug={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("generates and displays the QR code for a given slug", async () => {
    generateQRCode.mockResolvedValueOnce("data:image/png;base64,ABC");
    render(<QRCodeManager qrSlug="my-restaurant" />);

    await waitFor(() =>
      expect(generateQRCode).toHaveBeenCalledWith(
        "my-restaurant",
        "שחור עם רקע שקוף",
      ),
    );
    expect(await screen.findByAltText("QR Code")).toHaveAttribute(
      "src",
      "data:image/png;base64,ABC",
    );
  });

  it("downloads the QR code when the download button is clicked", async () => {
    generateQRCode.mockResolvedValueOnce("data:image/png;base64,ABC");
    render(<QRCodeManager qrSlug="my-restaurant" />);
    await screen.findByAltText("QR Code");

    fireEvent.click(screen.getByText("הורדת קוד QR"));
    expect(downloadQRCode).toHaveBeenCalledWith("data:image/png;base64,ABC");
  });

  it("re-generates the QR code when the color selection changes", async () => {
    generateQRCode.mockResolvedValue("data:image/png;base64,ABC");
    render(<QRCodeManager qrSlug="my-restaurant" />);
    await screen.findByAltText("QR Code");

    fireEvent.click(screen.getByText("change-color"));
    await waitFor(() =>
      expect(generateQRCode).toHaveBeenCalledWith(
        "my-restaurant",
        "שחור עם רקע לבן",
      ),
    );
  });
});
