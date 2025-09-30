import * as ticketService from "../services/ticketService.js";

export const getAllTicket = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const result = await ticketService.getAllTickets(page, pageSize);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({message: error.message || "Internal Server Error"});
    }
};

