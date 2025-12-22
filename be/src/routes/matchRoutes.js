import * as matchController from "../controllers/matchController.js";
import { auth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import express from "express";

const router = express.Router();

router.get("/",matchController.getAllMatches);
router.get("/:id",matchController.getMatchById);
router.post("/",upload.single("poster"),auth(['admin']),matchController.createMatch);
router.put("/:id",upload.single("poster"),auth(['admin']),matchController.updateMatch);
router.delete("/:id",auth(['admin']),matchController.cancelMatch);

export default router;