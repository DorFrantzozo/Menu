import axios from 'axios';
import mongoose from 'mongoose';
import User from './model/user.js';
import { generateToken, isAdminMiddleware } from './utils/jwt.js';

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://menuyou:15462h789X@cluster0.p716l.mongodb.net/menuyou?retryWrites=true&w=majority&appName=Cluster0');
  
  const admin = await User.findOne({ email: 'dorfrant@gmail.com' }); 
  console.log("Admin ID:", admin?._id);
  
  const token = generateToken(admin);
  
  try {
    const res = await axios.get('http://127.0.0.1:10000/api/admin/dashboard-stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS TYPE:", typeof res.data);
    console.log("SUCCESS IS ARRAY:", Array.isArray(res.data));
    console.log("SUCCESS PAYLOAD:", JSON.stringify(res.data).substring(0, 200));
  } catch (err) {
    console.error("ERROR Response:", err.response?.data || err.message);
  }
  
  process.exit(0);
}

test();
