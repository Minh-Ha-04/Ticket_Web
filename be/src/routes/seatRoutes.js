import * as seatController from "../controllers/seatController.js";
import express from "express";

const router = express.Router();

router.get("/section/:sectionId",seatController.getSeatsInSection);
router.post("/",seatController.createSeat);
router.put("/:id",seatController.updateSeat);

export default router;