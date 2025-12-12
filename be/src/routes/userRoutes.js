import express from "express";
import * as userController from "../controllers/userController.js";

import { authMiddleware } from "../utils/jwt.js";


const router = express.Router();

router.get("/", authMiddleware, userController.getProfile);
router.put("/update", authMiddleware, userController.updateProfile);
router.put("/change-password", authMiddleware, userController.changePassword);

router.get("/all", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
export default router;