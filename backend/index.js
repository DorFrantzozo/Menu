import express from "express";
import connect from "./connections/connect.js";
import userRouter from "./routes/user-route.js";
import categoryRouter from "./routes/category-route.js";
import dishRouter from "./routes/dish-route.js";
import { handleQrRedirect } from "./controllers/user-controller.js";
import cors from "cors";

import dotenv from "dotenv";
import assetRouter from "./routes/asset-route.js";
import analyticsRouter from "./routes/analyticsRoute.js";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

//TODO: in each route add validations using express-validator (if needed)
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dish", dishRouter);
app.use("/api/asset", assetRouter);
app.use("/api/analytics", analyticsRouter);

// Dynamic QR Redirect Route
app.get("/go/:slug", handleQrRedirect);

try {
  await connect();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database", error);
}
