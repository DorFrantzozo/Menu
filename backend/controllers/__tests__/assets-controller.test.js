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

vi.mock("../../utils/cloudinary.js", async () => {
  const actual = await vi.importActual("../../utils/cloudinary.js");
  return {
    ...actual,
    uploadTenantAsset: vi.fn().mockResolvedValue({
      secure_url: "https://res.cloudinary.com/test/image/upload/v1/mock.png",
      public_id: "restaurants/mock/assets/mock",
    }),
  };
});

import app from "../../app.js";
import Asset from "../../model/assets.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import { createAuthedUser } from "../../test-utils/authFixtures.js";
import { uploadTenantAsset } from "../../utils/cloudinary.js";

beforeAll(connectTestDb);
afterEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});
afterAll(disconnectTestDb);

describe("POST /api/asset/uploadAsset/:userId", () => {
  it("returns 400 when no file is attached", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post(`/api/asset/uploadAsset/${user._id}`)
      .field("fileName", "icon.png");
    expect(res.status).toBe(400);
  });

  it("returns 400 when fileName is missing", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post(`/api/asset/uploadAsset/${user._id}`)
      .attach("img", Buffer.from("fake-image-bytes"), "icon.png");
    expect(res.status).toBe(400);
  });

  it("uploads the asset and stores the Cloudinary URL", async () => {
    const { user } = await createAuthedUser();
    const res = await request(app)
      .post(`/api/asset/uploadAsset/${user._id}`)
      .field("fileName", "icon.png")
      .field("type", "image")
      .attach("img", Buffer.from("fake-image-bytes"), "icon.png");

    expect(res.status).toBe(201);
    expect(res.body.url).toBe(
      "https://res.cloudinary.com/test/image/upload/v1/mock.png",
    );
    expect(uploadTenantAsset).toHaveBeenCalledOnce();

    const stored = await Asset.findOne({ userId: user._id });
    expect(stored).toBeTruthy();
  });
});

describe("GET /api/asset/getAssets/:userId", () => {
  it("returns assets for the given user", async () => {
    const { user } = await createAuthedUser();
    await Asset.create({
      fileName: "icon.png",
      userId: user._id,
      url: "https://res.cloudinary.com/test/icon.png",
      publicId: "abc",
    });

    const res = await request(app).get(`/api/asset/getAssets/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
