import * as bookingController from "../controllers/bookingController.js";
import express from "express";
import { checkOwner } from "../middlewares/checkOwner.js";
import models from "../models/index.js";    
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/:id",auth(),checkOwner(models.Booking),bookingController.getBookingById);
router.get("/my",auth(),bookingController.getBookingByUserId);
router.post("/",auth(),bookingController.createBooking);
router.delete("/:id",auth(),checkOwner(models.Booking),bookingController.deleteBooking);

export default router; 