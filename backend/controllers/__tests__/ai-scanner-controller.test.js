import "../../test-utils/setupEnv.js";
import request from "supertest";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";

const generateContentMock = vi.fn();
vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function () {
    return { models: { generateContent: generateContentMock } };
  }),
}));

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
afterEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});
afterAll(disconnectTestDb);

describe("POST /api/ai/scan-menu", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app)
      .post("/api/ai/scan-menu")
      .attach("menuImage", Buffer.from("fake-bytes"), "menu.jpg");
    expect(res.status).toBe(401);
  });

  it("returns 400 when no image is attached", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post("/api/ai/scan-menu")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("parses the AI's JSON response into scannedItems", async () => {
    const { token } = await createAuthedUser();
    generateContentMock.mockResolvedValueOnce({
      text: 'Sure, here you go:\n[{"category":"עיקריות","name":"פסטה","description":"","price":45}]',
    });

    const res = await request(app)
      .post("/api/ai/scan-menu")
      .set("Authorization", `Bearer ${token}`)
      .attach("menuImage", Buffer.from("fake-bytes"), "menu.jpg");

    expect(res.status).toBe(200);
    expect(res.body.scannedItems).toEqual([
      { category: "עיקריות", name: "פסטה", description: "", price: 45 },
    ]);
  });

  it("returns an empty array when the AI response has no JSON array", async () => {
    const { token } = await createAuthedUser();
    generateContentMock.mockResolvedValueOnce({ text: "sorry, I can't help" });

    const res = await request(app)
      .post("/api/ai/scan-menu")
      .set("Authorization", `Bearer ${token}`)
      .attach("menuImage", Buffer.from("fake-bytes"), "menu.jpg");

    expect(res.status).toBe(200);
    expect(res.body.scannedItems).toEqual([]);
  });

  it("returns 503 when the AI service is overloaded", async () => {
    const { token } = await createAuthedUser();
    generateContentMock.mockRejectedValueOnce(new Error("503 overloaded"));

    const res = await request(app)
      .post("/api/ai/scan-menu")
      .set("Authorization", `Bearer ${token}`)
      .attach("menuImage", Buffer.from("fake-bytes"), "menu.jpg");

    expect(res.status).toBe(503);
    expect(res.body.error).toBe("AI_BUSY");
  });
});

describe("POST /api/ai/save-scanned", () => {
  it("returns 400 when categories is not an array", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/ai/save-scanned")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user._id.toString() });
    expect(res.status).toBe(400);
  });

  it("creates new categories and dishes from the scanned data", async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post("/api/ai/save-scanned")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user._id.toString(),
        categories: [
          {
            name: "עיקריות",
            items: [{ name: "פסטה", price: "45" }, { name: "סלט", price: "30" }],
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.insertedDishes).toBe(2);
    expect(await Category.countDocuments({ userId: user._id })).toBe(1);
    expect(await Dish.countDocuments({ userId: user._id })).toBe(2);
  });

  it("reuses an existing category with a matching name instead of duplicating it", async () => {
    const { token, user } = await createAuthedUser();
    await Category.create({ userId: user._id, name: "עיקריות", locationNumber: 1 });

    const res = await request(app)
      .post("/api/ai/save-scanned")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user._id.toString(),
        categories: [{ name: "עיקריות", items: [{ name: "פסטה", price: "45" }] }],
      });

    expect(res.status).toBe(201);
    expect(await Category.countDocuments({ userId: user._id })).toBe(1);
  });
});
