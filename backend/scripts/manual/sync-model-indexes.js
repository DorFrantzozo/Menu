import "dotenv/config";
import mongoose from "mongoose";
import Category from "../../model/category.js";
import Dish from "../../model/dish.js";
import Payment from "../../model/payment.js";
import Asset from "../../model/assets.js";

// Deliberate, explicit index sync — connects with autoIndex disabled so nothing
// happens implicitly, then syncs exactly the models listed here, one at a time,
// with the result printed for each.
async function main() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the environment variables.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URL, { autoIndex: false });

  for (const Model of [Category, Dish, Payment, Asset]) {
    const result = await Model.syncIndexes();
    console.log(`${Model.modelName}: syncIndexes() ->`, JSON.stringify(result));
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
