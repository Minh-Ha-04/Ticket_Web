import * as ticketController from '../controllers/ticketController.js';
import express from 'express';

const router = express.Router();

router.post('/generate/:matchId', ticketController.generateTickets);

export  default router;