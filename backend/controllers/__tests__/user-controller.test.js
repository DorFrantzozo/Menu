import "../../test-utils/setupEnv.js";
import request from "supertest";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import app from "../../app.js";
import User from "../../model/user.js";
import Category from "../../model/category.js";
import Dish from "../../model/dish.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import { createAuthedUser } from "../../test-utils/authFixtures.js";

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

describe("PUT /api/user/updateUser/:userId", () => {
  it("returns 401 with no Authorization header", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .send({ displayName: "שם חדש" });
    expect(res.status).toBe(401);
  });

  it("returns 403 when updating a different user's profile", async () => {
    const { token } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${otherUser._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ displayName: "שם חדש" });
    expect(res.status).toBe(403);
  });

  it("updates the user's own profile fields", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ displayName: "שם חדש", phone: "0521111111" });

    expect(res.status).toBe(200);
    expect(res.body.user.displayName).toBe("שם חדש");
    expect(res.body.user.password).toBeUndefined();
  });

  it("returns 403 when a non-admin tries to change isPaid or role", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPaid: true, role: "admin" });

    expect(res.status).toBe(403);
  });

  it("allows an admin to grant isPaid to another user", async () => {
    const { token: adminToken } = await createAuthedUser({ role: "admin" });
    const { user: targetUser } = await createAuthedUser();

    const res = await request(app)
      .put(`/api/user/updateUser/${targetUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isPaid: true });

    expect(res.status).toBe(200);
    expect(res.body.user.isPaid).toBe(true);
  });
});

describe("POST /api/user/deleteUser", () => {
  it("returns 401 for incorrect credentials", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post("/api/user/deleteUser")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "owner1@example.com", password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("deletes the account with correct credentials", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/user/deleteUser")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: user.email, password: "secret123" });

    expect(res.status).toBe(200);
    expect(await User.findById(user._id)).toBeNull();
  });
});

describe("GET /api/user/slug/:slug", () => {
  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/api/user/slug/no-such-restaurant");
    expect(res.status).toBe(404);
  });

  it("returns the user (without password) for a known slug", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app).get(`/api/user/slug/${user.qrSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });
});

describe("GET /api/user/getMenu/:userId", () => {
  it("returns 404 for an unknown user", async () => {
    const res = await request(app).get(
      "/api/user/getMenu/507f1f77bcf86cd799439011",
    );
    expect(res.status).toBe(404);
  });

  it("returns categories and dishes grouped by category (legacy flat response)", async () => {
    const { user } = await createAuthedUser();
    const category = await Category.create({
      userId: user._id,
      name: "עיקריות",
      locationNumber: 1,
    });
    await Dish.create({ userId: user._id, name: "פסטה", category: category._id });

    const res = await request(app).get(`/api/user/getMenu/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.categories).toHaveLength(1);
    expect(res.body.dishes[category._id.toString()]).toHaveLength(1);
  });
});

describe("PATCH /api/user/complete-tour", () => {
  it("returns 403 when completing the tour for a different user", async () => {
    const { token } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const res = await request(app)
      .patch("/api/user/complete-tour")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: otherUser._id.toString() });
    expect(res.status).toBe(403);
  });

  it("marks the tour as completed for the authenticated user", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .patch("/api/user/complete-tour")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user._id.toString() });

    expect(res.status).toBe(200);
    const updated = await User.findById(user._id);
    expect(updated.hasCompletedTour).toBe(true);
  });
});

describe("GET /api/auth/me (getCurrentUser)", () => {
  it("returns the authenticated user's own profile", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });
});
