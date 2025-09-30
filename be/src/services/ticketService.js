import Ticket from "../models/ticket.js";
import Match from "../models/match.js";
import Team from "../models/team.js";

export const getAllTickets = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * limit;
    const {count, rows} = await Ticket.findAndCountAll({
        limit: pageSize,
        offset: offset,
        include: [
            {
                model: Match,
                as: 'match',    
                include: [
                    {model: Team,as : 'homeTeam',attributes: ['teamName']},
                    {model: Team,as : 'awayTeam',attributes: ['teamName']}
                ]
                
            }
        ]
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        tickets: rows
    };
}   


                


                    
