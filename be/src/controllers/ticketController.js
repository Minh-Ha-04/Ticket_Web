import ticketService from "../services/ticketService.js";

export const getTeamNameByTicket = async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const result = await ticketService.getTeamNameByTicket(ticketId);
        if(!result) {
            return res.status(404).json({message : "Ticket not found"});
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({message : error.message || "Internal server error"});
    }
};

