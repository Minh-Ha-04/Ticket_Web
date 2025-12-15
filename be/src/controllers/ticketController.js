import * as ticketService from "../services/ticketService.js";

export const getTicketInfoByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const data = await ticketService.getTicketInfoByMatch(matchId);

    return res.status(200).json({
      success: true,
      matchId,
      sections: data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get ticket info"
    });
  }
};
