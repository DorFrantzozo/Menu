// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/utils/baseUrl", () => ({ default: { get: vi.fn() } }));

import axiosInstance from "@/utils/baseUrl";
import { getFreshUser } from "@/utils/fetchData";

describe("getFreshUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "a-token");
  });
  afterEach(() => localStorage.clear());

  // The current user is served by /auth/me. Pointing this at /user/me returns a
  // 404 that App.jsx swallows, leaving the cached user stale forever.
  it("requests the route that serves the current user", async () => {
    axiosInstance.get.mockResolvedValue({ data: { plan: "iMenu PRO" } });

    const user = await getFreshUser();

    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/me", expect.anything());
    expect(user.plan).toBe("iMenu PRO");
  });

  it("skips the request entirely when no token is stored", async () => {
    localStorage.removeItem("token");

    await expect(getFreshUser()).resolves.toBeNull();
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });
});
