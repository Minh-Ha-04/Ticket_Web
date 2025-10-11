import * as ticketService from "../services/ticketService.js";

export const generateTickets = async (req, res) => {
    try {
      const { matchId } = req.params;
      const file = req.file;
      const result = await ticketService.generateTicketsForHomeTeam(matchId,file);
  
      res.status(201).json({
        message: `Tạo vé thành công cho trận đấu ${matchId}`,
        data: result,
      });
    }catch (error) {
      console.error("Lỗi khi tạo vé:", error);
      res.status(500).json({
        message: error.message || "Lỗi server khi tạo vé",
      });
    }
  };

export const deleteTickets = async (req,res)=>{
  try{
    const {matchId} = req.params;
    const result = await ticketService.deleteTicketForMatch(matchId);
    res.status(200).json({
      data:result,
      message: `Đã xóa vé của trận ${matchId}`
    });
  }
  catch(error)
  {
    res.status(500).json({
      message : error.message
    })
  }
};

