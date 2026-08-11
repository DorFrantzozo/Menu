import 'dotenv/config';
import axios from 'axios';

// Get token from local storage roughly by reading the user's DB
import mongoose from 'mongoose';
import User from '../../model/user.js';
import { generateToken } from '../../utils/jwt.js';

async function test() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the environment variables.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URL);
  const admin = await User.findOne({ email: 'dorfrant@gmail.com' }); // dor is admin according to screenshot
  
  if (!admin) {
    console.log("Admin not found");
    process.exit(1);
  }

  const token = generateToken(admin);
  
  try {
    const res = await axios.get('http://localhost:10000/api/admin/dashboard-stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS Data type:", Array.isArray(res.data) ? 'Array' : typeof res.data);
    console.log("SUCCESS Data preview:", JSON.stringify(res.data).substring(0, 100));
  } catch (err) {
    console.error("ERROR Response:", err.response?.data || err.message);
  }
  
  process.exit(0);
}

test();
