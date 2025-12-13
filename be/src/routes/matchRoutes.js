import * as matchController from "../controllers/matchController.js";
import { auth } from "../middlewares/auth.js";
import express from "express";

const router = express.Router();

router.get("/",matchController.getAllMatches);
router.get("/home",matchController.getMatchAtHome);
router.get("/:id",matchController.getMatchById);
router.post("/",auth(['admin']),matchController.creatMatch);
router.put("/:id",auth(['admin']),matchController.updateMatch);
router.delete("/:id",auth(['admin']),matchController.cancelMatch);

export default router;