import express from 'express';
import authRoutes from './authRoutes.js';
import ticketRoutes from './ticketRoutes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);

export default router;