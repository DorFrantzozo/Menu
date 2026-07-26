import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/user.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env file");
  process.exit(1);
}

const runMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const result = await User.updateMany(
      { isVerified: { $exists: false } },
      { $set: { isVerified: true } }
    );
    
    // Also update any that were set to false before we started enforcing it
    const result2 = await User.updateMany(
      { isVerified: false },
      { $set: { isVerified: true } }
    );

    console.log(`Migration completed. Updated ${result.modifiedCount + result2.modifiedCount} users to isVerified: true.`);
    process.exit(0);
  } catch (err) {
    console.error("Error during migration:", err);
    process.exit(1);
  }
};

runMigration();
