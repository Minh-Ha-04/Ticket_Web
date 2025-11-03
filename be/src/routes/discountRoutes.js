import * as discountController from "../controllers/discountController.js";
import express from "express";

const router = express.Router();

router.post("/", discountController.createDiscount);
router.delete("/:id",discountController.deleteDiscount);
router.get("/:matchId", discountController.getDiscountsInMatch);
router.get("/:matchId/validate/:code", discountController.validateDiscount);
router.patch("/:id/increment", discountController.incrementUsage);

export default router;
