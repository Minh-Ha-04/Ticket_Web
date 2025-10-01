import * as ticketController from '../controllers/ticketController.js';
import express from 'express';

const router = express.Router();

router.get('/', ticketController.getAllTicket);

export  default router;