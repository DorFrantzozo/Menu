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

vi.mock("../../utils/discordAlert.js", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

import app from "../../app.js";
import sendDiscordAlert from "../../utils/discordAlert.js";
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

describe("POST /api/support/open-ticket", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app).post("/api/support/open-ticket").send({});
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post("/api/support/open-ticket")
      .set("Authorization", `Bearer ${token}`)
      .send({ subject: "בעיה" });
    expect(res.status).toBe(400);
  });

  it("sends a Discord alert and returns 200 for a valid ticket", async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post("/api/support/open-ticket")
      .set("Authorization", `Bearer ${token}`)
      .send({ subject: "בעיה", message: "יש תקלה", urgency: "Urgent" });

    expect(res.status).toBe(200);
    expect(sendDiscordAlert).toHaveBeenCalledWith(
      expect.stringContaining("בעיה"),
      expect.any(String),
      15158332,
      "tickets",
    );
  });
});
