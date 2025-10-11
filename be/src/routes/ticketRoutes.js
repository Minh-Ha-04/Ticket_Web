import * as ticketController from '../controllers/ticketController.js';
import express from 'express';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/generate/:matchId',upload.single("poster"), ticketController.generateTickets);

router.delete('/:matchId',ticketController.deleteTickets);

export  default router;