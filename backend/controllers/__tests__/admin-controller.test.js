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

  it("includes the billing window the renewal UI depends on", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const paidThrough = new Date(2099, 8, 19);
    const { user: restaurant } = await createAuthedUser({
      plan: "iMenu PRO",
      isPaid: true,
      subscriptionStatus: "active",
      nextPaymentDate: paidThrough,
    });

    const res = await request(app)
      .get("/api/admin/dashboard-stats")
      .set("Authorization", `Bearer ${token}`);

    const row = res.body.find((r) => r._id === restaurant._id.toString());
    expect(new Date(row.nextPaymentDate).getTime()).toBe(paidThrough.getTime());
    expect(row.subscriptionStatus).toBe("active");
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

  it("returns the full user so plan-dependent UI does not fall back to a default", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({ plan: "iMenu PRO" });

    const res = await request(app)
      .post(`/api/admin/impersonate/${target._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("iMenu PRO");
    expect(res.body.user.password).toBeUndefined();
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

describe("PATCH /api/admin/users/:id/renew-subscription", () => {
  const renew = async (targetId, adminToken, body = {}) =>
    request(app)
      .patch(`/api/admin/users/${targetId}/renew-subscription`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(body);

  it("returns 404 for an unknown user", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const res = await renew("507f1f77bcf86cd799439011", token);
    expect(res.status).toBe(404);
  });

  it("refuses to renew a Free user", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({ plan: "Free" });

    const res = await renew(target._id, token);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no subscription/i);
  });

  it.each([0, 13, 1.5, "two", null])("rejects months=%p", async (months) => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({ plan: "Essential" });

    const res = await renew(target._id, token, { months });

    expect(res.status).toBe(400);
  });

  it("adds the month to the end of the period already paid for", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({
      plan: "Essential",
      isPaid: true,
      nextPaymentDate: new Date(2099, 5, 15), // 15 Jun 2099, still in the future
    });

    const res = await renew(target._id, token, { months: 1 });

    expect(res.status).toBe(200);
    const renewed = new Date(res.body.nextPaymentDate);
    expect(renewed.getFullYear()).toBe(2099);
    expect(renewed.getMonth()).toBe(6); // July
    expect(renewed.getDate()).toBe(15);
  });

  it("starts from today when the previous period has already lapsed", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({
      plan: "Essential",
      isPaid: true,
      nextPaymentDate: new Date(2020, 0, 1), // long gone
    });

    const res = await renew(target._id, token, { months: 1 });

    expect(res.status).toBe(200);
    const daysOut =
      (new Date(res.body.nextPaymentDate) - Date.now()) / (1000 * 60 * 60 * 24);
    expect(daysOut).toBeGreaterThan(27);
    expect(daysOut).toBeLessThan(32);
  });

  it("clamps to the end of the month instead of overflowing", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({
      plan: "Essential",
      isPaid: true,
      nextPaymentDate: new Date(2099, 0, 31), // 31 Jan; February has no 31st
    });

    const res = await renew(target._id, token, { months: 1 });

    const renewed = new Date(res.body.nextPaymentDate);
    expect(renewed.getMonth()).toBe(1); // February, not March
    expect(renewed.getDate()).toBe(28);
  });

  it("reinstates a cancelled subscription", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const { user: target } = await createAuthedUser({
      plan: "iMenu PRO",
      isPaid: false,
      subscriptionStatus: "canceled",
    });

    const res = await renew(target._id, token, { months: 1 });

    expect(res.status).toBe(200);
    expect(res.body.isPaid).toBe(true);
    expect(res.body.subscriptionStatus).toBe("active");
  });

  it("leaves the plan and the trial window untouched", async () => {
    const { token } = await createAuthedUser({ role: "admin" });
    const trialEnds = new Date(2030, 2, 20);
    const { user: target } = await createAuthedUser({
      plan: "iMenu PRO",
      isPaid: true,
      trialExpiresAt: trialEnds,
    });

    await renew(target._id, token, { months: 3 });

    const after = await User.findById(target._id);
    expect(after.plan).toBe("iMenu PRO");
    expect(after.trialExpiresAt.getTime()).toBe(trialEnds.getTime());
  });
});
