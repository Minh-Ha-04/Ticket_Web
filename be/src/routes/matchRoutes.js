import * as matchController from "../controllers/matchController.js";
import express from "express";

const router = express.Router();

router.get("/",matchController.getAllMatches);
router.get("/home",matchController.getMatchAtHome);
router.get("/:id",matchController.getMatchbyId);
router.post("/",matchController.creatMatch);
router.put("/:id",matchController.updateMatch);
router.delete("/:id",matchController.deleteMatch);

export default router;