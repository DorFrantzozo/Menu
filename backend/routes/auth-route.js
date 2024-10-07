import express from "express";

const authRouter = express.Router();
router.get("/me", isAuth, (req, res) => {
  // Send user data from the middleware
  res.json(req.user);
});

export default authRouter;
