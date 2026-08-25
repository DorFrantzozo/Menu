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

  it("normalises and stores a Google review link", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ googleReviewUrl: "g.page/r/CxAbc123/review" });

    expect(res.status).toBe(200);
    const rs = res.body.user.reviewSettings;
    expect(rs.urlStatus).toBe("valid");
    expect(rs.googleReviewUrl).toBe("g.page/r/CxAbc123/review");
    expect(rs.resolvedUrl).toBe("https://g.page/r/CxAbc123/review");
  });

  it("marks a non-Google link invalid and leaves the prompt off", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ googleReviewUrl: "https://example.com/review" });

    expect(res.status).toBe(200);
    expect(res.body.user.reviewSettings.urlStatus).toBe("invalid");
    expect(res.body.user.reviewSettings.isEnabled).toBe(false);
  });

  it("refuses to switch the prompt on without a valid link", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ reviewPromptEnabled: "true" });

    expect(res.status).toBe(200);
    expect(res.body.user.reviewSettings.isEnabled).toBe(false);
  });

  it("switches the prompt on once a valid link is in place", async () => {
    const { token, user } = await createAuthedUser();
    await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ googleReviewUrl: "https://g.page/r/CxAbc123/review" });

    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ reviewPromptEnabled: "true", promptDelayMinutes: "25" });

    expect(res.status).toBe(200);
    expect(res.body.user.reviewSettings.isEnabled).toBe(true);
    expect(res.body.user.reviewSettings.promptDelayMinutes).toBe(25);
  });

  // Replacing a working link with a broken one must not leave diners being
  // sent somewhere useless.
  it("turns a live prompt off when the link is replaced by a bad one", async () => {
    const { token, user } = await createAuthedUser();
    await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ googleReviewUrl: "https://g.page/r/CxAbc123/review" });
    await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ reviewPromptEnabled: "true" });

    const res = await request(app)
      .put(`/api/user/updateUser/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ googleReviewUrl: "totally not a url" });

    expect(res.status).toBe(200);
    expect(res.body.user.reviewSettings.urlStatus).toBe("invalid");
    expect(res.body.user.reviewSettings.isEnabled).toBe(false);
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

  it("returns only the fields the public menu renders", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app).get(`/api/user/slug/${user.qrSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.restaurantName).toBe(user.restaurantName);
    // Subset, not equality: optional fields the fixture never set (such as
    // menuDescription) are simply absent from the document.
    const allowed = [
      "_id",
      "restaurantName",
      "displayName",
      "menuDescription",
      "designNumber",
      "isPaid",
      "trialExpiresAt",
    ];
    expect(Object.keys(res.body).filter((k) => !allowed.includes(k))).toEqual([]);
  });

  // This endpoint is unauthenticated: anyone who can open a menu can call it.
  it("never exposes credentials, billing or contact details", async () => {
    const { user } = await createAuthedUser();
    await User.updateOne(
      { _id: user._id },
      {
        morningCustomerId: "cust_123",
        morningPaymentToken: "tok_secret",
        lastFourDigits: "4242",
        wifiSettings: { isEnabled: true, ssid: "net", wifiPassword: "hunter2" },
      },
    );

    const res = await request(app).get(`/api/user/slug/${user.qrSlug}`);
    expect(res.status).toBe(200);
    for (const field of [
      "password",
      "email",
      "phone",
      "morningCustomerId",
      "morningPaymentToken",
      "lastFourDigits",
      "wifiSettings",
      "role",
    ]) {
      expect(res.body[field]).toBeUndefined();
    }
    expect(JSON.stringify(res.body)).not.toContain("hunter2");
  });
});

describe("GET /api/user/slug/:slug — review prompt gates", () => {
  const liveLink = {
    isEnabled: true,
    googleReviewUrl: "https://g.page/r/CxAbc/review",
    resolvedUrl: "https://g.page/r/CxAbc/review",
    urlStatus: "valid",
    promptDelayMinutes: 25,
  };
  const pro = {plan: "iMenu PRO", isPaid: true};

  const fetchMenu = async (overrides) => {
    const {user} = await createAuthedUser(overrides);
    return request(app).get(`/api/user/slug/${user.qrSlug}`);
  };

  it("sends the prompt only when every gate passes", async () => {
    const res = await fetchMenu({...pro, reviewSettings: liveLink});
    expect(res.status).toBe(200);
    expect(res.body.reviewSettings).toEqual({
      resolvedUrl: "https://g.page/r/CxAbc/review",
      promptDelayMinutes: 25,
    });
  });

  it("withholds it below iMenu PRO", async () => {
    for (const plan of ["Free", "Essential", "Advance"]) {
      const res = await fetchMenu({plan, isPaid: true, reviewSettings: liveLink});
      expect(res.body.reviewSettings).toBeUndefined();
    }
  });

  it("withholds it when the owner switched it off", async () => {
    const res = await fetchMenu({
      ...pro,
      reviewSettings: {...liveLink, isEnabled: false},
    });
    expect(res.body.reviewSettings).toBeUndefined();
  });

  it("withholds it when the link never validated", async () => {
    const res = await fetchMenu({
      ...pro,
      reviewSettings: {...liveLink, urlStatus: "invalid"},
    });
    expect(res.body.reviewSettings).toBeUndefined();
  });

  it("withholds it once the trial has lapsed unpaid", async () => {
    const res = await fetchMenu({
      plan: "iMenu PRO",
      isPaid: false,
      trialExpiresAt: new Date(Date.now() - 86400000),
      reviewSettings: liveLink,
    });
    expect(res.body.reviewSettings).toBeUndefined();
  });

  it("withholds it for an owner who never configured it", async () => {
    const res = await fetchMenu(pro);
    expect(res.body.reviewSettings).toBeUndefined();
  });

  // The gate reads plan and the raw settings; neither may reach the diner.
  it("never leaks the plan or the unresolved link alongside the prompt", async () => {
    const res = await fetchMenu({...pro, reviewSettings: liveLink});
    expect(res.body.plan).toBeUndefined();
    expect(Object.keys(res.body.reviewSettings)).toEqual([
      "resolvedUrl",
      "promptDelayMinutes",
    ]);
    expect(JSON.stringify(res.body)).not.toContain("urlStatus");
  });
});

describe("GET /api/user/find", () => {
  it("returns the restaurant for a known name", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app).get(
      `/api/user/find?name=${encodeURIComponent(user.restaurantName)}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.restaurantName).toBe(user.restaurantName);
  });

  // Same leak as the slug endpoint, same unauthenticated exposure.
  it("never exposes credentials, billing or contact details", async () => {
    const { user } = await createAuthedUser();
    await User.updateOne(
      { _id: user._id },
      { morningPaymentToken: "tok_secret", lastFourDigits: "4242" },
    );

    const res = await request(app).get(
      `/api/user/find?name=${encodeURIComponent(user.restaurantName)}`,
    );
    expect(res.status).toBe(200);
    for (const field of [
      "password",
      "email",
      "phone",
      "morningPaymentToken",
      "lastFourDigits",
    ]) {
      expect(res.body[field]).toBeUndefined();
    }
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
