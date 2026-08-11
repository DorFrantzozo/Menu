import "../../test-utils/setupEnv.js";
import request from "supertest";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import app from "../../app.js";
import Dish from "../../model/dish.js";
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

async function createCategory(userId) {
  return Category.create({ userId, name: "עיקריות", locationNumber: 1 });
}

describe("POST /api/dish/createDish/:userId", () => {
  it("returns 400 when required fields are missing", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post(`/api/dish/createDish/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 401 with no Authorization header", async () => {
    const { user } = await createAuthedUser();
    const category = await createCategory(user._id);
    const res = await request(app)
      .post(`/api/dish/createDish/${user._id}`)
      .send({ name: "פסטה", category: category._id.toString() });
    expect(res.status).toBe(401);
  });

  it("returns 403 when creating a dish for a different user", async () => {
    const { token } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const category = await createCategory(otherUser._id);

    const res = await request(app)
      .post(`/api/dish/createDish/${otherUser._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "פסטה", category: category._id.toString() });
    expect(res.status).toBe(403);
  });

  it("creates a dish for the authenticated user", async () => {
    const { token, user } = await createAuthedUser();
    const category = await createCategory(user._id);

    const res = await request(app)
      .post(`/api/dish/createDish/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "פסטה",
        price: "45",
        category: category._id.toString(),
        gluten: "true",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("פסטה");
    expect(res.body.price).toBe(45);
    expect(res.body.gluten).toBe(true);
  });

  it("returns 400 for a duplicate dish name for the same user", async () => {
    const { token, user } = await createAuthedUser();
    const category = await createCategory(user._id);
    await Dish.create({ userId: user._id, name: "פסטה", category: category._id });

    const res = await request(app)
      .post(`/api/dish/createDish/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "פסטה", category: category._id.toString() });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/dish/getDish/:userId/:category", () => {
  it("returns dishes for the given category sorted by locationNumber", async () => {
    const { user } = await createAuthedUser();
    const category = await createCategory(user._id);
    await Dish.create({
      userId: user._id,
      name: "סלט",
      category: category._id,
      locationNumber: 2,
    });
    await Dish.create({
      userId: user._id,
      name: "פסטה",
      category: category._id,
      locationNumber: 1,
    });

    const res = await request(app).get(
      `/api/dish/getDish/${user._id}/${category._id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.map((d) => d.name)).toEqual(["פסטה", "סלט"]);
  });
});

describe("GET /api/dish/getAllDishes/:userId", () => {
  it("returns 400 for a literal 'undefined' userId", async () => {
    const res = await request(app).get("/api/dish/getAllDishes/undefined");
    expect(res.status).toBe(400);
  });

  it("returns all dishes for the user across categories", async () => {
    const { user } = await createAuthedUser();
    const category = await createCategory(user._id);
    await Dish.create({ userId: user._id, name: "פסטה", category: category._id });
    await Dish.create({ userId: user._id, name: "סלט", category: category._id });

    const res = await request(app).get(`/api/dish/getAllDishes/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("PUT /api/dish/updateDish/:userId/:dishId", () => {
  it("returns 404 when the dish does not belong to the user", async () => {
    const { token, user } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const category = await createCategory(otherUser._id);
    const dish = await Dish.create({
      userId: otherUser._id,
      name: "פסטה",
      category: category._id,
    });

    const res = await request(app)
      .put(`/api/dish/updateDish/${user._id}/${dish._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "פסטה חדשה" });
    expect(res.status).toBe(404);
  });

  it("updates the dish", async () => {
    const { token, user } = await createAuthedUser();
    const category = await createCategory(user._id);
    const dish = await Dish.create({
      userId: user._id,
      name: "פסטה",
      category: category._id,
    });

    const res = await request(app)
      .put(`/api/dish/updateDish/${user._id}/${dish._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "פסטה עם רוטב", category: category._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("פסטה עם רוטב");
  });
});

describe("DELETE /api/dish/deleteDish/:userId/:dishId", () => {
  it("returns 404 when the dish is not found", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .delete(`/api/dish/deleteDish/${user._id}/507f1f77bcf86cd799439011`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("deletes the dish", async () => {
    const { token, user } = await createAuthedUser();
    const category = await createCategory(user._id);
    const dish = await Dish.create({
      userId: user._id,
      name: "פסטה",
      category: category._id,
    });

    const res = await request(app)
      .delete(`/api/dish/deleteDish/${user._id}/${dish._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await Dish.findById(dish._id)).toBeNull();
  });
});

describe("PUT /api/dish/reorderDishes/:userId", () => {
  it("returns 400 when dishes is not an array", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/dish/reorderDishes/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ dishes: "not-an-array" });
    expect(res.status).toBe(400);
  });

  it("reorders dishes", async () => {
    const { token, user } = await createAuthedUser();
    const category = await createCategory(user._id);
    const dishA = await Dish.create({ userId: user._id, name: "A", category: category._id });
    const dishB = await Dish.create({ userId: user._id, name: "B", category: category._id });

    const res = await request(app)
      .put(`/api/dish/reorderDishes/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        dishes: [
          { _id: dishA._id.toString(), locationNumber: 2 },
          { _id: dishB._id.toString(), locationNumber: 1 },
        ],
      });

    expect(res.status).toBe(200);
    const updatedA = await Dish.findById(dishA._id);
    expect(updatedA.locationNumber).toBe(2);
  });
});
