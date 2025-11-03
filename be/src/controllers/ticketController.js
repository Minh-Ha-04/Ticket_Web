import * as ticketService from "../services/ticketService.js";

export const generateTickets = async (req, res) => {
    try {
      const { matchId } = req.params;
      const file = req.file;
      const { sections } = req.body;
      const sectionData = JSON.parse(sections);
      const result = await ticketService.generateTicketsForHomeTeam(matchId,file,sectionData);
  
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

export const updateTicket = async(req,res) => {
  try{
    const {matchId} = req.params;
    const file = req.file || null;
    const sections = req.body.sections ? JSON.parse(req.body.sections) : [];
    const result = await ticketService.updateTicketForMatch(matchId, file, sections);
    return res.status(200).json({
      message: "Cập nhật vé và poster thành công!",
      data: result,
    });
  } catch (error) {
    console.error(" Lỗi cập nhật vé:", error);
    return res.status(500).json({
      message: "Cập nhật vé thất bại!",
      error: error.message,
    });
  }
}

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

export const getTicketsBySectionAndMatch = async (req, res) => {
  try {
    const { sectionId, matchId } = req.params;
    const tickets = await ticketService.getTicketsBySectionAndMatch(sectionId, matchId);

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy vé cho khu này." });
    }

    res.json({ tickets });
  } catch (error) {
    console.error("Lỗi khi lấy vé theo khu và trận:", error);
    res.status(500).json({ message: "Lỗi server khi lấy vé." });
  }
};

export const getTicketPriceByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const sections = await ticketService.getTicketPriceByMatch(matchId);
    if (!sections || sections.length === 0)
      return res.status(404).json({ message: "Không tìm thấy vé cho trận đấu này" });
    res.status(200).json({ sections });
  } catch (error) {
    console.error("Lỗi khi lấy giá vé:", error);
    res.status(500).json({ message: "Lỗi khi lấy giá vé của trận đấu" });;
  }
};

export const getTicketSoldByMatch = async (req,res) =>{
  try{
    const {matchId} = req.params;

    const stats   = await ticketService.getTicketSoldByMatch(matchId);
    res.status(200).json(stats);
  }
  catch(error)
  {
    console.error("Error fetching ticket stats by match:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


