import express from 'express';
import * as payController from "../controllers/payController.js";
import * as jwt from "../utils/jwt.js";
const router = express.Router();

router.post('/create',jwt.authMiddleware,payController.createPayment);
// routes/payRoutes.js
router.post('/momo-ipn', payController.momoIpn);
router.get("/confirm", payController.confirmPayment);

export default router;
