import * as sectionController from "../controllers/sectionController.js";
import express from 'express';

const router = express.Router();

router.get("/stadium/:stadiumId",sectionController.getAllSections);
router.post("/",sectionController.createSection);
router.put("/:id",sectionController.updateSection);
router.delete("/:id",sectionController.deleteSection);

export default router;
