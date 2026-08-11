import "../../test-utils/setupEnv.js";
import request from "supertest";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import app from "../../app.js";
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

describe("POST /api/category/createCategory", () => {
  it("returns 400 when required fields are missing", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/category/createCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user._id.toString() });
    expect(res.status).toBe(400);
  });

  it("returns 401 with no Authorization header", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/category/createCategory")
      .send({ userId: user._id.toString(), name: "עיקריות", locationNumber: 1 });
    expect(res.status).toBe(401);
  });

  it("returns 403 when creating a category for a different user", async () => {
    const { token } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const res = await request(app)
      .post("/api/category/createCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: otherUser._id.toString(),
        name: "עיקריות",
        locationNumber: 1,
      });
    expect(res.status).toBe(403);
  });

  it("creates a category for the authenticated user", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/category/createCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user._id.toString(),
        name: "עיקריות",
        locationNumber: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.newCategory.name).toBe("עיקריות");

    const stored = await Category.findOne({ userId: user._id });
    expect(stored).toBeTruthy();
  });

  it("returns 400 when the category name already exists for the user", async () => {
    const { token, user } = await createAuthedUser();
    await Category.create({ userId: user._id, name: "עיקריות", locationNumber: 1 });

    const res = await request(app)
      .post("/api/category/createCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user._id.toString(),
        name: "עיקריות",
        locationNumber: 2,
      });
    expect(res.status).toBe(400);
  });

  it("returns 200 without creating a duplicate when the location number is already used", async () => {
    const { token, user } = await createAuthedUser();
    await Category.create({ userId: user._id, name: "עיקריות", locationNumber: 1 });

    const res = await request(app)
      .post("/api/category/createCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user._id.toString(),
        name: "קינוחים",
        locationNumber: 1,
      });

    expect(res.status).toBe(200);
    const count = await Category.countDocuments({ userId: user._id });
    expect(count).toBe(1);
  });
});

describe("GET /api/category/getCategories/:userId", () => {
  it("returns the categories for a user without requiring auth", async () => {
    const { user } = await createAuthedUser();
    await Category.create({ userId: user._id, name: "עיקריות", locationNumber: 1 });
    await Category.create({ userId: user._id, name: "קינוחים", locationNumber: 2 });

    const res = await request(app).get(
      `/api/category/getCategories/${user._id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("PUT /api/category/updateCategory/:userId/:categoryId", () => {
  it("returns 401 with no Authorization header", async () => {
    const { user } = await createAuthedUser();
    const category = await Category.create({
      userId: user._id,
      name: "עיקריות",
      locationNumber: 1,
    });
    const res = await request(app).put(
      `/api/category/updateCategory/${user._id}/${category._id}`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when the category does not belong to the user", async () => {
    const { token, user } = await createAuthedUser();
    const { user: otherUser } = await createAuthedUser();
    const category = await Category.create({
      userId: otherUser._id,
      name: "עיקריות",
      locationNumber: 1,
    });

    const res = await request(app)
      .put(`/api/category/updateCategory/${user._id}/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newName: "חדש" });
    expect(res.status).toBe(404);
  });

  it("updates the category name", async () => {
    const { token, user } = await createAuthedUser();
    const category = await Category.create({
      userId: user._id,
      name: "עיקריות",
      locationNumber: 1,
    });

    const res = await request(app)
      .put(`/api/category/updateCategory/${user._id}/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newName: "עיקריות חדשות" });

    expect(res.status).toBe(200);
    expect(res.body.category.name).toBe("עיקריות חדשות");
  });
});

describe("DELETE /api/category/deleteCategory/:userId/:categoryId", () => {
  it("returns 404 when the category is not found", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .delete(`/api/category/deleteCategory/${user._id}/507f1f77bcf86cd799439011`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("deletes the category and its dishes", async () => {
    const { token, user } = await createAuthedUser();
    const category = await Category.create({
      userId: user._id,
      name: "עיקריות",
      locationNumber: 1,
    });
    await Dish.create({
      userId: user._id,
      name: "פסטה",
      category: category._id,
    });

    const res = await request(app)
      .delete(`/api/category/deleteCategory/${user._id}/${category._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedDishesCount).toBe(1);
    expect(await Category.findById(category._id)).toBeNull();
    expect(await Dish.countDocuments({ category: category._id })).toBe(0);
  });
});

describe("PUT /api/category/reorderCategories/:userId", () => {
  it("returns 400 when categories is not an array", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .put(`/api/category/reorderCategories/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ categories: "not-an-array" });
    expect(res.status).toBe(400);
  });

  it("reorders categories by locationNumber", async () => {
    const { token, user } = await createAuthedUser();
    const catA = await Category.create({ userId: user._id, name: "A", locationNumber: 1 });
    const catB = await Category.create({ userId: user._id, name: "B", locationNumber: 2 });

    const res = await request(app)
      .put(`/api/category/reorderCategories/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        categories: [
          { _id: catA._id.toString(), locationNumber: 2 },
          { _id: catB._id.toString(), locationNumber: 1 },
        ],
      });

    expect(res.status).toBe(200);
    const updatedA = await Category.findById(catA._id);
    expect(updatedA.locationNumber).toBe(2);
  });
});
