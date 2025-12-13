import express from 'express';
import * as payController from "../controllers/payController.js";
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.post('/create',auth(),payController.createPayment);
// routes/payRoutes.js
router.post('/momo-ipn', payController.momoIpn);
router.get("/confirm", payController.confirmPayment);

export default router;
