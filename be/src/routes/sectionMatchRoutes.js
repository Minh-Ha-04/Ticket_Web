import express from "express";
import * as sectionMatchController from "../controllers/sectionMatchController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/section-match/:matchId
router.get("/:matchId", sectionMatchController.getSectionsForMatch);
router.put("/:matchId",auth(['admin']), sectionMatchController.updateSectionMatches);
export default router;
