import express from 'express';
import authRoutes from './authRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import stadiumRoutes from './stadiumRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/stadiums',stadiumRoutes);

export default router;