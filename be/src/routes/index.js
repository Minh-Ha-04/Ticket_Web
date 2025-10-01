import express from 'express';
import authRoutes from './authRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import stadiumRoutes from './stadiumRoutes.js';
import teamRoutes from './teamRoutes.js'; 

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/stadiums',stadiumRoutes);
router.use('/teams',teamRoutes);

export default router;