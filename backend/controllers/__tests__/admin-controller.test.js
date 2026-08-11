import "../../test-utils/setupEnv.js";
import request from "supertest";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import app from "../../app.js";
import User from "../../model/user.js";
import Category from "../../model/category.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import { createAuthedUser } from "../../test-utils/authFixtures.js";

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

describe("admin routes auth gate", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app).get("/api/admin/dashboard-stats");
    expect(res.status).toBe(401);
  });

  it("returns 403 for a non-admin user", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .get("/api/admin/dashboard-stats")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/dashboard-stats", () => {
  it("returns per-user stats without the password field", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: restaurant } = await createAuthedUser();
    await Category.create({ userId: restaurant._id, name: "עיקריות", locationNumber: 1 });

    const res = await request(app)
      .get("/api/admin/dashboard-stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const row = res.body.find((r) => r._id === restaurant._id.toString());
    expect(row).toBeTruthy();
    expect(row.menuSize).toBe(1);
    expect(row.password).toBeUndefined();
  });
});

describe("POST /api/admin/impersonate/:userId", () => {
  it("returns 404 for an unknown user", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const res = await request(app)
      .post("/api/admin/impersonate/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("returns a valid token for the target user", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser();

    const res = await request(app)
      .post(`/api/admin/impersonate/${target._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(target.email);
  });
});

describe("PUT /api/admin/users/:id", () => {
  it("returns 404 for an unknown user", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const res = await request(app)
      .put("/api/admin/users/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "Advance" });
    expect(res.status).toBe(404);
  });

  it("upgrades the plan and marks the user as paid", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser();

    const res = await request(app)
      .put(`/api/admin/users/${target._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "Advance" });

    expect(res.status).toBe(200);
    expect(res.body.plan).toBe("Advance");
    expect(res.body.isPaid).toBe(true);
    expect(res.body.subscriptionStatus).toBe("active");
  });

  it("downgrading to Free marks the user unpaid and canceled", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({
      plan: "Advance",
      isPaid: true,
      subscriptionStatus: "active",
    });

    const res = await request(app)
      .put(`/api/admin/users/${target._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "Free" });

    expect(res.status).toBe(200);
    expect(res.body.isPaid).toBe(false);
    expect(res.body.subscriptionStatus).toBe("canceled");
  });
});

describe("GET /api/admin/urgent-actions", () => {
  it("lists users whose trial expires within 7 days", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);
    const { user: expiringSoon } = await createAuthedUser({
      trialExpiresAt: soon,
    });
    // Not expiring soon (default fixture trial is 14 days out)
    await createAuthedUser();

    const res = await request(app)
      .get("/api/admin/urgent-actions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const ids = res.body.map((item) => item._id);
    expect(ids).toContain(expiringSoon._id.toString());
    expect(res.body.length).toBe(1);
  });
});
