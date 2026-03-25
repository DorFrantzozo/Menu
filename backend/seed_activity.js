import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import ActivityLog from "./model/activityLog.js";
import User from "./model/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB.");
    
    // Check if we already have logs to prevent double seeding
    const existingLogs = await ActivityLog.countDocuments();
    if (existingLogs > 0) {
      console.log(`Already found ${existingLogs} logs. Clearing old logs before seeding new ones...`);
      await ActivityLog.deleteMany({});
    }
    
    const users = await User.find();
    if (users.length === 0) {
      console.log("No users found. Cannot seed.");
      process.exit(0);
    }
    
    // Seed for the primary user
    const user = users[0];
    console.log("Seeding for user:", user.restaurantName, user._id);
    
    // Generate 300 random logs over the last 30 days
    const logs = [];
    const now = new Date();
    
    for (let i = 0; i < 300; i++) {
        // Random day within the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const randomDate = new Date(now);
        randomDate.setDate(now.getDate() - daysAgo);
        
        // Add random time during the day, biased towards evening (18:00-22:00)
        let hour;
        const rand = Math.random();
        if (rand > 0.6) {
          // 40% chance of being in "peak" hours: 18:00 to 22:00
          hour = 18 + Math.floor(Math.random() * 5); 
        } else if (rand > 0.3) {
           // 30% chance for lunch: 12:00 to 14:00
          hour = 12 + Math.floor(Math.random() * 3);
        } else {
          // 30% chance of being anywhere else
          hour = Math.floor(Math.random() * 24);
        }
        
        randomDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
        
        const types = ["qr_scan", "menu_view", "dish_view"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        logs.push({
            restaurantId: user._id,
            type: randomType,
            timestamp: randomDate
        });
    }
    
    await ActivityLog.insertMany(logs);
    console.log("Successfully seeded 300 mock random activity logs!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
