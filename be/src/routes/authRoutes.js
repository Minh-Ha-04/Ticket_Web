import express from "express";
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../utils/jwt.js";
import passport from "passport";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login-failed`,
    session: false,
  }),
  authController.googleCallback
);

router.get("/me", verifyToken, authController.getMe);

export default router;
