import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

let counter = 0;

export async function createAuthedUser(overrides = {}) {
  counter += 1;
  const hashedPassword = await bcrypt.hash("secret123", 10);
  const user = await User.create({
    email: `owner${counter}@example.com`,
    password: hashedPassword,
    restaurantName: "MyRestaurant",
    displayName: "המסעדה שלי",
    phone: "0500000000",
    isVerified: true,
    ...overrides,
  });
  const token = generateToken(user);
  return { user, token };
}
