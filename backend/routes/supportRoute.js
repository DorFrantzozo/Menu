import express from "express";
import { openTicket } from "../controllers/support-controller.js";
import { isAuth } from "../utils/jwt.js";

const router = express.Router();

router.post("/open-ticket", isAuth, openTicket);

export default router;
