import express from 'express';
import authRoutes from './authRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import stadiumRoutes from './stadiumRoutes.js';
import teamRoutes from './teamRoutes.js'; 
import sectionRoutes from './sectionRoutes.js';
import seatRoutes from './seatRoutes.js';
import matchRoutes from './matchRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/stadiums',stadiumRoutes);
router.use('/teams',teamRoutes);
router.use('/sections',sectionRoutes);
router.use('/seats',seatRoutes);
router.use('/matches',matchRoutes);

export default router;