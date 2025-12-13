import * as stadiumController from "../controllers/stadiumController.js";
import express from "express";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/",stadiumController.getAllStadiums);
router.post("/",auth(['admin']),stadiumController.createStadium);
router.put("/:id",auth(['admin']),stadiumController.updateStadium);
router.delete("/:id",auth(['admin']),stadiumController.deleteStadium);

export default router ;