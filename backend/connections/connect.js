import mongoose from "mongoose";

const connect = async () => {
  try {
    // autoIndex is off: any process that connects (including one-off scripts)
    // must not silently build/change indexes as a side effect. Index changes
    // are applied deliberately via backend/scripts/manual/sync-model-indexes.js.
    await mongoose.connect(process.env.MONGO_URL, { autoIndex: false });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

export default connect;
