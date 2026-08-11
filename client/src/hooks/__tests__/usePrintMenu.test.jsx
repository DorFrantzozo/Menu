// @vitest-environment jsdom
import React from "react";
import { renderHook, act, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { usePrintMenu } from "../usePrintMenu";
import printMenuReducer from "@/state/printMenu/printMenuSlice";
import { generateQRCode } from "@/utils/qrGenerator";

vi.mock("@/utils/qrGenerator", () => ({
  generateQRCode: vi.fn(),
}));

function makeWrapper() {
  const store = configureStore({ reducer: { printMenu: printMenuReducer } });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, Wrapper };
}

describe("usePrintMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateQRCode.mockResolvedValue("data:image/png;base64,default");
    vi.spyOn(window, "print").mockImplementation(() => {});
  });

  afterEach(() => cleanup());

  it("starts closed with the default config", () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => usePrintMenu({ qrSlug: "slug" }), {
      wrapper: Wrapper,
    });
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.config.paperSize).toBe("A4");
  });

  it("opens and closes the modal", () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => usePrintMenu({ qrSlug: "slug" }), {
      wrapper: Wrapper,
    });
    act(() => result.current.openModal());
    expect(result.current.isModalOpen).toBe(true);
    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
  });

  it("generates a QR code when includeQrCode is on and the user has a qrSlug", async () => {
    generateQRCode.mockResolvedValueOnce("data:image/png;base64,QR");
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => usePrintMenu({ qrSlug: "my-slug" }), {
      wrapper: Wrapper,
    });

    await waitFor(() =>
      expect(result.current.qrCodeDataUrl).toBe("data:image/png;base64,QR"),
    );
    expect(generateQRCode).toHaveBeenCalledWith("my-slug");
  });

  it("clears the QR code when includeQrCode is disabled", () => {
    const { Wrapper, store } = makeWrapper();
    const { result } = renderHook(() => usePrintMenu({ qrSlug: "my-slug" }), {
      wrapper: Wrapper,
    });
    act(() => result.current.updateConfig({ includeQrCode: false }));
    expect(result.current.qrCodeDataUrl).toBeNull();
    expect(store.getState().printMenu.config.includeQrCode).toBe(false);
  });

  it("dispatches printStarted synchronously on handlePrint", () => {
    const { Wrapper } = makeWrapper();
    const { result } = renderHook(() => usePrintMenu({ qrSlug: "slug" }), {
      wrapper: Wrapper,
    });
    act(() => result.current.handlePrint());
    expect(result.current.isPrinting).toBe(true);
  });
});
