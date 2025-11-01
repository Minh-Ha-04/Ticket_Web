import * as ticketController from '../controllers/ticketController.js';
import express from 'express';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/generate/:matchId',upload.single("poster"), ticketController.generateTickets);
router.put('/:matchId',upload.single("poster"),ticketController.updateTicket);
router.delete('/:matchId',ticketController.deleteTickets);

router.get("/section/:sectionId/match/:matchId", ticketController.getTicketsBySectionAndMatch);


router.get("/match/:matchId", ticketController.getTicketPriceByMatch);

export  default router;