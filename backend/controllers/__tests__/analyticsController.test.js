import "../../test-utils/setupEnv.js";
import request from "supertest";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import app from "../../app.js";
import Dish from "../../model/dish.js";
import Category from "../../model/category.js";
import DishStats from "../../model/dishStats.js";
import MenuStats from "../../model/menuStats.js";
import ActivityLog from "../../model/activityLog.js";
import cache from "../../utils/cache.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import { createAuthedUser } from "../../test-utils/authFixtures.js";

beforeAll(connectTestDb);
afterEach(async () => {
  await clearTestDb();
  cache.flushAll();
});
afterAll(disconnectTestDb);

async function createDish(userId) {
  const category = await Category.create({
    userId,
    name: "עיקריות",
    locationNumber: 1,
  });
  return Dish.create({ userId, name: "פסטה", category: category._id });
}

describe("POST /api/analytics/view", () => {
  it("returns 400 when dishId is missing", async () => {
    const res = await request(app).post("/api/analytics/view").send({});
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown dish", async () => {
    const res = await request(app)
      .post("/api/analytics/view")
      .send({ dishId: "507f1f77bcf86cd799439011" });
    expect(res.status).toBe(404);
  });

  it("upserts a DishStats row for today", async () => {
    const { user } = await createAuthedUser();
    const dish = await createDish(user._id);

    const res = await request(app)
      .post("/api/analytics/view")
      .send({ dishId: dish._id.toString() });

    expect(res.status).toBe(200);
    const stats = await DishStats.findOne({ dishId: dish._id });
    expect(stats.views).toBe(1);

    // A second view the same day increments instead of duplicating
    await request(app)
      .post("/api/analytics/view")
      .send({ dishId: dish._id.toString() });
    const statsAfter = await DishStats.findOne({ dishId: dish._id });
    expect(statsAfter.views).toBe(2);
    expect(await DishStats.countDocuments({ dishId: dish._id })).toBe(1);
  });
});

describe("POST /api/analytics/like", () => {
  it("returns 400 for an invalid dishId", async () => {
    const res = await request(app)
      .post("/api/analytics/like")
      .send({ dishId: "not-an-id", deviceId: "device-1" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when deviceId is missing", async () => {
    const { user } = await createAuthedUser();
    const dish = await createDish(user._id);
    const res = await request(app)
      .post("/api/analytics/like")
      .send({ dishId: dish._id.toString() });
    expect(res.status).toBe(400);
  });

  it("increments likes on first like", async () => {
    const { user } = await createAuthedUser();
    const dish = await createDish(user._id);

    const res = await request(app)
      .post("/api/analytics/like")
      .send({ dishId: dish._id.toString(), deviceId: "device-1" });

    expect(res.status).toBe(200);
    const updated = await Dish.findById(dish._id);
    expect(updated.likes).toBe(1);
  });

  it("silently ignores a repeat like from the same device within 24h", async () => {
    const { user } = await createAuthedUser();
    const dish = await createDish(user._id);

    await request(app)
      .post("/api/analytics/like")
      .send({ dishId: dish._id.toString(), deviceId: "device-1" });
    const res = await request(app)
      .post("/api/analytics/like")
      .send({ dishId: dish._id.toString(), deviceId: "device-1" });

    expect(res.status).toBe(200);
    const updated = await Dish.findById(dish._id);
    expect(updated.likes).toBe(1);
  });
});

describe("POST /api/analytics/menu-view", () => {
  it("returns 400 when restaurantId is missing", async () => {
    const res = await request(app).post("/api/analytics/menu-view").send({});
    expect(res.status).toBe(400);
  });

  it("upserts a MenuStats row and increments totalQrScans", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/analytics/menu-view")
      .send({ restaurantId: user._id.toString() });

    expect(res.status).toBe(200);
    const stats = await MenuStats.findOne({ restaurantId: user._id });
    expect(stats.views).toBe(1);
  });
});

describe("POST /api/analytics/review-event", () => {
  it("returns 400 when restaurantId is missing", async () => {
    const res = await request(app)
      .post("/api/analytics/review-event")
      .send({ event: "click" });
    expect(res.status).toBe(400);
  });

  // The menu is public, so the event name must never reach the enum unchecked.
  it("rejects an event name it does not recognise", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/analytics/review-event")
      .send({ restaurantId: user._id.toString(), event: "drop_table" });

    expect(res.status).toBe(400);
    expect(await ActivityLog.countDocuments({ restaurantId: user._id })).toBe(0);
  });

  it("counts an impression against the right column", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/analytics/review-event")
      .send({ restaurantId: user._id.toString(), event: "shown" });

    expect(res.status).toBe(200);
    const stats = await MenuStats.findOne({ restaurantId: user._id });
    expect(stats.reviewPromptShown).toBe(1);
    expect(stats.reviewClicks).toBe(0);
    expect(
      await ActivityLog.countDocuments({
        restaurantId: user._id,
        type: "review_prompt_shown",
      }),
    ).toBe(1);
  });

  it("counts a click without touching menu views", async () => {
    const { user } = await createAuthedUser();
    await request(app)
      .post("/api/analytics/review-event")
      .send({ restaurantId: user._id.toString(), event: "click" });

    const stats = await MenuStats.findOne({ restaurantId: user._id });
    expect(stats.reviewClicks).toBe(1);
    expect(stats.views).toBe(0);
  });
});

describe("GET /api/analytics/review-stats", () => {
  it("requires authentication", async () => {
    const res = await request(app).get("/api/analytics/review-stats");
    expect(res.status).toBe(401);
  });

  it("returns the funnel and the rate between its two steps", async () => {
    const { user, token } = await createAuthedUser();
    const id = user._id.toString();
    for (let i = 0; i < 4; i += 1) {
      await request(app)
        .post("/api/analytics/review-event")
        .send({ restaurantId: id, event: "shown" });
    }
    await request(app)
      .post("/api/analytics/review-event")
      .send({ restaurantId: id, event: "click" });

    const res = await request(app)
      .get(`/api/analytics/review-stats?restaurantId=${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totals).toEqual({ shown: 4, clicks: 1, clickRate: 25 });
    expect(res.body.totalClicksAllTime).toBe(1);
  });

  // A cleared session or a stale counter can leave more clicks than
  // impressions. An owner must never be shown "300% conversion".
  it("never reports a rate above 100%", async () => {
    const { user, token } = await createAuthedUser();
    const id = user._id.toString();
    await request(app)
      .post("/api/analytics/review-event")
      .send({ restaurantId: id, event: "shown" });
    for (let i = 0; i < 3; i += 1) {
      await request(app)
        .post("/api/analytics/review-event")
        .send({ restaurantId: id, event: "click" });
    }

    const res = await request(app)
      .get(`/api/analytics/review-stats?restaurantId=${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.totals.shown).toBe(1);
    expect(res.body.totals.clicks).toBe(3);
    expect(res.body.totals.clickRate).toBe(100);
  });

  it("reports a zero rate rather than dividing by zero", async () => {
    const { user, token } = await createAuthedUser();
    const res = await request(app)
      .get(`/api/analytics/review-stats?restaurantId=${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totals.clickRate).toBe(0);
  });
});

describe("GET /api/analytics/menu-views", () => {
  it("returns 400 when restaurantId is missing", async () => {
    const res = await request(app).get("/api/analytics/menu-views");
    expect(res.status).toBe(400);
  });

  it("returns formatted stats and an all-time total", async () => {
    const { user } = await createAuthedUser();
    await request(app)
      .post("/api/analytics/menu-view")
      .send({ restaurantId: user._id.toString() });

    const res = await request(app)
      .get("/api/analytics/menu-views")
      .query({ restaurantId: user._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.totalAllTime).toBe(1);
    expect(res.body.formattedStats).toHaveLength(1);
  });
});

describe("GET /api/analytics/top-dishes", () => {
  it("returns 400 when restaurantId is missing", async () => {
    const res = await request(app).get("/api/analytics/top-dishes");
    expect(res.status).toBe(400);
  });

  it("returns an empty list when there is no view data", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .get("/api/analytics/top-dishes")
      .query({ restaurantId: user._id.toString() });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/analytics/peak-activity/:userId", () => {
  it("returns 401 with no Authorization header", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app).get(
      `/api/analytics/peak-activity/${user._id}`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown user", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .get("/api/analytics/peak-activity/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("returns 7 days and 24 hours of (empty) buckets when there is no activity", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .get(`/api/analytics/peak-activity/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.daysData).toHaveLength(7);
    expect(res.body.hoursData).toHaveLength(24);
  });
});

describe("POST /api/analytics/clear-my-data", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app).post("/api/analytics/clear-my-data");
    expect(res.status).toBe(401);
  });

  it("deletes all activity logs for the authenticated user", async () => {
    const { token, user } = await createAuthedUser();
    await ActivityLog.create({ restaurantId: user._id, type: "menu_view" });
    await ActivityLog.create({ restaurantId: user._id, type: "dish_view" });

    const res = await request(app)
      .post("/api/analytics/clear-my-data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedCount).toBe(2);
    expect(await ActivityLog.countDocuments({ restaurantId: user._id })).toBe(0);
  });
});
