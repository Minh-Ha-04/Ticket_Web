import express from "express";
import * as userController from "../controllers/userController.js";

import { authMiddleware } from "../utils/jwt.js";


const router = express.Router();

router.get("/", authMiddleware, userController.getProfile);
router.put("/update", authMiddleware, userController.updateProfile);
router.put("/change-password", authMiddleware, userController.changePassword);

export default router;