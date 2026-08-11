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

vi.mock("../../services/ai services/marketingLabService.js", () => ({
  generateMarketingPost: vi.fn(),
}));

import app from "../../app.js";
import { UserWallet } from "../../model/userWallet.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import { createAuthedUser } from "../../test-utils/authFixtures.js";
import { generateMarketingPost as generateMarketingPostService } from "../../services/ai services/marketingLabService.js";

beforeAll(connectTestDb);
afterEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});
afterAll(disconnectTestDb);

describe("POST /api/marketing/generate", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app).post("/api/marketing/generate").send({});
    expect(res.status).toBe(401);
  });

  it("returns 403 once the daily credit limit is used up", async () => {
    const { token, user } = await createAuthedUser();
    await UserWallet.create({ userId: user._id, dailyLimit: 10, usedToday: 10 });

    const res = await request(app)
      .post("/api/marketing/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ platform: "instagram", format: "post", userText: "מבצע חדש" });

    expect(res.status).toBe(403);
    expect(generateMarketingPostService).not.toHaveBeenCalled();
  });

  it(
    "generates a post, charges the wallet, and returns credits left",
    async () => {
      const { token, user } = await createAuthedUser();
      generateMarketingPostService.mockResolvedValueOnce({
        caption: "מבצע חדש!",
      });

      const res = await request(app)
        .post("/api/marketing/generate")
        .set("Authorization", `Bearer ${token}`)
        .send({ platform: "instagram", format: "post", userText: "מבצע חדש" });

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ caption: "מבצע חדש!" });
      expect(res.body.creditsLeft).toBe(9);

      const wallet = await UserWallet.findOne({ userId: user._id });
      expect(wallet.usedToday).toBe(1);
    },
    15000,
  );

  it("returns 500 without charging the wallet when the AI service throws", async () => {
    const { token, user } = await createAuthedUser();
    generateMarketingPostService.mockRejectedValueOnce(new Error("AI down"));

    const res = await request(app)
      .post("/api/marketing/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ platform: "instagram", format: "post", userText: "מבצע חדש" });

    expect(res.status).toBe(500);
    const wallet = await UserWallet.findOne({ userId: user._id });
    expect(wallet.usedToday).toBe(0);
  });
});
