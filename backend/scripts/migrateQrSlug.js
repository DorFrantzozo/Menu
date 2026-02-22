import mongoose from "mongoose";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from the .env file in the backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import the User model
import User from "../model/user.js";

const migrateQrSlug = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URL is not defined in the environment variables.");
      process.exit(1);
    }

    console.log("Connecting to the database...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Find all users that either don't have the qrSlug field or have it as empty/null
    const usersToMigrate = await User.find({
      $or: [{ qrSlug: { $exists: false } }, { qrSlug: null }, { qrSlug: "" }],
    });

    console.log(`Found ${usersToMigrate.length} users to migrate.`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersToMigrate) {
      try {
        let slugExists = true;
        let newSlug = "";

        // Generate a unique slug
        while (slugExists) {
          newSlug = nanoid(8);
          // We can check against the database directly to ensure uniqueness across ALL users, not just migrating ones
          const existingUser = await User.findOne({ qrSlug: newSlug });
          if (!existingUser) {
            slugExists = false;
          }
        }

        user.qrSlug = newSlug;
        // By using updateOne we bypass full document validation, 
        // which helps avoiding errors on legacy records missing other required fields.
        await User.updateOne({ _id: user._id }, { $set: { qrSlug: newSlug } });
        successCount++;
        console.log(`Successfully migrated user ${user._id} with qrSlug: ${newSlug}`);
      } catch (err) {
        console.error(`Failed to migrate user ${user._id}:`, err.message);
        errorCount++;
      }
    }

    console.log("\nMigration completed.");
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed to migrate: ${errorCount}`);
  } catch (err) {
    console.error("An error occurred during migration:", err);
  } finally {
    console.log("Closing database connection...");
    await mongoose.connection.close();
    process.exit(0);
  }
};

migrateQrSlug();
