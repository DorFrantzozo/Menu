import "dotenv/config";
import mongoose from "mongoose";
import ActivityLog from "../../model/activityLog.js";

// Read-only dry run: shows what the new 90-day TTL index would delete,
// without creating the index or touching any data. Safe to run against production.
const RETENTION_DAYS = 90;

async function main() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URL);

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const [totalCount, expiredCount, oldest] = await Promise.all([
    ActivityLog.countDocuments({}),
    ActivityLog.countDocuments({ timestamp: { $lt: cutoff } }),
    ActivityLog.findOne({}).sort({ timestamp: 1 }).select("timestamp").lean(),
  ]);

  console.log(`Retention cutoff: documents older than ${cutoff.toISOString()} (${RETENTION_DAYS} days) would be deleted.`);
  console.log(`Total ActivityLog documents: ${totalCount}`);
  console.log(`Documents that would be deleted almost immediately after the TTL index is added: ${expiredCount}`);
  console.log(`Oldest document timestamp: ${oldest ? oldest.timestamp.toISOString() : "(collection is empty)"}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
