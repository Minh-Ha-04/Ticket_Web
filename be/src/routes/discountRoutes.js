import * as discountController from "../controllers/discountController.js";
import express from "express";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/",auth(['admin']), discountController.createDiscount);
router.delete("/:id",auth(['admin']),discountController.deleteDiscount);
router.get("/:matchId", discountController.getDiscountsInMatch);
router.get("/:matchId/validate/:code", discountController.validateDiscount);
router.patch("/:id/increment", discountController.incrementUsage);

export default router;
