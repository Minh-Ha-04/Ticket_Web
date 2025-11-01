import * as bookingController from "../controllers/bookingController.js";
import express from "express";
const router = express.Router();

router.get("/:id",bookingController.getBookingById);
router.post("/",bookingController.createBooking);
router.delete("/",bookingController.deleteBooking);

export default router; 