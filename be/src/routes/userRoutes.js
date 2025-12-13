import express from "express";
import * as userController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";



const router = express.Router();

router.get("/", auth(), userController.getProfile);
router.put("/update", auth(), userController.updateProfile);
router.put("/change-password", auth(), userController.changePassword);

router.get("/all",auth(['admin']), userController.getUsers);
router.post("/",auth(['admin']), userController.createUser);
router.put("/:id",auth(['admin']), userController.updateUser);
router.delete("/:id",auth(['admin']), userController.deleteUser);
export default router;