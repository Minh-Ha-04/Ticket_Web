import * as ticketService from "../services/ticketService.js";

export const generateTickets = async (req, res) => {
    try {
      const { matchId } = req.params;
  
      await ticketService.generateTicketsForHomeTeam(matchId);
  
      res.status(201).json({message: `Tạo vé thành công cho trận đấu ${matchId}`,});
    } catch (error) {
      console.error("Lỗi khi tạo vé:", error);
      res.status(500).json({message: error.message || "Lỗi server khi tạo vé"});
    }
  };