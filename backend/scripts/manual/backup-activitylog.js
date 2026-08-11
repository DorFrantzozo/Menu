import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";

// One-off safety-net backup before enabling the ActivityLog TTL index.
// Writes outside the repo on purpose — this is a raw snapshot of production data.
const OUT_PATH = "C:\\Users\\dorfr\\AppData\\Local\\Temp\\claude\\C--Users-dorfr-Desktop-Projects-Menu\\dd112ff4-70d4-4301-b708-0eb5b32667da\\scratchpad\\activitylog-backup.json";

async function main() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the environment variables.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URL);

  const docs = await mongoose.connection.db.collection("activitylogs").find({}).toArray();
  fs.writeFileSync(OUT_PATH, JSON.stringify(docs));

  console.log(`Backed up ${docs.length} ActivityLog documents to ${OUT_PATH}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
