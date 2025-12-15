import express from "express";
import { getTicketInfoByMatch } from "../controllers/ticketController.js";
import {auth} from '../middlewares/auth.js';
const router = express.Router();

router.get("/matches/:matchId/ticket-info",auth(['admin']), getTicketInfoByMatch);

export default router;
