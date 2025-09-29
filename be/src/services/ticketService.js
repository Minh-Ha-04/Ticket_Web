import Ticket from "../models/ticket";
import Match from "../models/match";
import Team from "../models/team";

const getTeamNameByTicket = async (ticketId) => {
    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        const match = await Match.findByPk(ticket.matchId);
        if (!match) {
            throw new Error("Match not found");
        }

        const homeTeam = await Team.findByPk(match.homeTeamId);
        const awayTeam = await Team.findByPk(match.awayTeamId);

        if (!homeTeam || !awayTeam) {
            throw new Error("Team not found");
        }

        return {
            ...ticket.toJSON(),
            homeTeamName: homeTeam.name,
            awayTeamName: awayTeam.name
        };
    } catch (error) {
        throw new Error(error.message || "Error retrieving team names");
    }
};
export { getTeamNameByTicket };