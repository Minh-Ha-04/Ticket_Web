import express from 'express';
import * as payController from "../controllers/payController.js";

const router = express.Router();

router.post('/create',payController.createPayment);
// routes/payRoutes.js
router.post('/momo-ipn', payController.momoIpn);


export default router;
