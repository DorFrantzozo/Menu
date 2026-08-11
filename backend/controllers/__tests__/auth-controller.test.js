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
import bcrypt from "bcryptjs";

vi.mock("../../utils/sendgrid.js", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));
vi.mock("../../utils/discordAlert.js", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

import app from "../../app.js";
import User from "../../model/user.js";
import { sendEmail } from "../../utils/sendgrid.js";
import {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} from "../../test-utils/testDb.js";
import {
  generateResetToken,
  generateVerificationToken,
} from "../../utils/jwt.js";

beforeAll(connectTestDb);
afterEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});
afterAll(disconnectTestDb);

const validSignup = {
  email: "owner@example.com",
  password: "secret123",
  restaurantName: "MyRestaurant",
  displayName: "המסעדה שלי",
  phone: "0500000000",
};

async function createVerifiedUser(overrides = {}) {
  const hashedPassword = await bcrypt.hash("secret123", 10);
  return User.create({
    email: "owner@example.com",
    password: hashedPassword,
    restaurantName: "MyRestaurant",
    displayName: "המסעדה שלי",
    phone: "0500000000",
    isVerified: true,
    ...overrides,
  });
}

describe("POST /api/auth/signup", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "owner@example.com" });
    expect(res.status).toBe(400);
  });

  it("creates an unverified user and sends a verification email", async () => {
    const res = await request(app).post("/api/auth/signup").send(validSignup);

    expect(res.status).toBe(201);
    expect(res.body.requiresVerification).toBe(true);

    const user = await User.findOne({ email: validSignup.email });
    expect(user).toBeTruthy();
    expect(user.isVerified).toBe(false);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: validSignup.email }),
    );
  });

  it("returns 400 when the email is already registered", async () => {
    await createVerifiedUser();
    const res = await request(app).post("/api/auth/signup").send(validSignup);
    expect(res.status).toBe(400);
  });

  it("never returns the password hash in the response", async () => {
    const res = await request(app).post("/api/auth/signup").send(validSignup);
    expect(JSON.stringify(res.body)).not.toContain("password");
  });
});

describe("POST /api/auth/login", () => {
  it("returns 401 for a non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "whatever" });
    expect(res.status).toBe(401);
  });

  it("returns 403 and requiresVerification when the user has not verified their email", async () => {
    await createVerifiedUser({ isVerified: false });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@example.com", password: "secret123" });
    expect(res.status).toBe(403);
    expect(res.body.requiresVerification).toBe(true);
  });

  it("returns 401 for an incorrect password", async () => {
    await createVerifiedUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@example.com", password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("logs in successfully and returns a token without the password hash", async () => {
    await createVerifiedUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@example.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.email).toBe("owner@example.com");
  });
});

describe("POST /api/auth/verifyEmail", () => {
  it("returns 400 when the token is missing", async () => {
    const res = await request(app).post("/api/auth/verifyEmail").send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/verifyEmail")
      .send({ token: "not-a-real-token" });
    expect(res.status).toBe(400);
  });

  it("verifies the user for a valid token", async () => {
    const user = await createVerifiedUser({ isVerified: false });
    const token = generateVerificationToken(user);

    const res = await request(app)
      .post("/api/auth/verifyEmail")
      .send({ token });

    expect(res.status).toBe(200);
    const updated = await User.findById(user._id);
    expect(updated.isVerified).toBe(true);
  });
});

describe("POST /api/auth/sendResetPasswordLink", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/sendResetPasswordLink")
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/sendResetPasswordLink")
      .send({ to: "nobody@example.com", userName: "Nobody" });
    expect(res.status).toBe(404);
  });

  it("sends the reset email for a known user", async () => {
    await createVerifiedUser();
    const res = await request(app)
      .post("/api/auth/sendResetPasswordLink")
      .send({ to: "owner@example.com", userName: "Owner" });

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "owner@example.com" }),
    );
  });
});

describe("POST /api/auth/resetPassword", () => {
  it("returns 400 for an invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/resetPassword")
      .send({ data: { token: "garbage", newPassword: "newSecret123" } });
    expect(res.status).toBe(400);
  });

  it("rejects reusing the same password", async () => {
    const user = await createVerifiedUser();
    const token = generateResetToken(user);

    const res = await request(app)
      .post("/api/auth/resetPassword")
      .send({ data: { token, newPassword: "secret123" } });

    expect(res.status).toBe(400);
  });

  it("resets the password for a valid token", async () => {
    const user = await createVerifiedUser();
    const token = generateResetToken(user);

    const res = await request(app)
      .post("/api/auth/resetPassword")
      .send({ data: { token, newPassword: "brandNewSecret456" } });

    expect(res.status).toBe(200);
    const updated = await User.findById(user._id);
    const matches = await bcrypt.compare(
      "brandNewSecret456",
      updated.password,
    );
    expect(matches).toBe(true);
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 with no Authorization header", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 for an invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });
});
