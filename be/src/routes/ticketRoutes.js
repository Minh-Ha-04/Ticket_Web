import * as ticketController from '../controllers/ticketController.js';
import express from 'express';
import upload from '../middlewares/upload.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.post('/generate/:matchId',auth(['admin']),upload.single("poster"), ticketController.generateTickets);
router.put('/:matchId',auth(['admin']),upload.single("poster"),ticketController.updateTicket);
router.delete('/:matchId',auth(['admin']),ticketController.deleteTickets);

router.get("/section/:sectionId/match/:matchId", ticketController.getTicketsBySectionAndMatch);


router.get("/match/:matchId", ticketController.getTicketPriceByMatch);

router.get("/stats/:matchId",auth(['admin']),ticketController.getTicketSoldByMatch);

export  default router;