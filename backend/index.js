import express from "express";
import connect from "./connections/connect.js";
import userRouter from "./routes/user-route.js";
import categoryRouter from "./routes/category-route.js";
import dishRouter from "./routes/dish-route.js";
import cors from "cors";

import dotenv from "dotenv";
import assetRouter from "./routes/asset-route.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dish", dishRouter);
app.use("/api/asset", assetRouter);
try {
  await connect();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database", error);
}
