import * as bookingController from "../controllers/bookingController.js";
import express from "express";
const router = express.Router();

router.get("/:id",bookingController.getBookingById);
router.get("/user/:userId",bookingController.getBookingByUserId);
router.post("/",bookingController.createBooking);
router.delete("/",bookingController.deleteBooking);

export default router; 