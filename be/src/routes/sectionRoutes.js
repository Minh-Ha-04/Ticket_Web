import * as sectionController from "../controllers/sectionController.js";
import express from 'express';
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/stadium/:stadiumId",sectionController.getAllSections);
router.post("/",auth(['admin']),sectionController.createSection);
router.put("/:id",auth(['admin']),sectionController.updateSection);
router.delete("/:id",auth(['admin']),sectionController.deleteSection);

export default router;
