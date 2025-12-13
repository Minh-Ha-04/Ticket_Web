import models from "../models/index.js";
const {Match,Team,Stadium,Ticket} = models;

export const getAllMatches = async()=>{
    const matches = await Match.findAll({
        include :[
            {model : Team, as : 'homeTeam' , attributes :['id','name','logo']},
            {model : Team ,as : 'awayTeam' , attributes :['id','name','logo']},
            {model : Stadium, attributes : ['id','name']},
        ],
        order : [["matchDate","ASC"]],
    });
    return matches;
}

export const getMatchAtHome = async () => {
      const HOME_STADIUM_ID = process.env.HOME_STADIUM_ID ;

      const matches = await Match.findAll({
        where: { stadiumId: HOME_STADIUM_ID },
        include: [
          { model: Team, as: "homeTeam", attributes: ["id", "name",'logo'] },
          { model: Team, as: "awayTeam", attributes: ["id", "name",'logo'] },
          { model: Stadium, attributes: ["id", "name"] },     
        ],
        order: [["matchDate", "ASC"]],
      });

      const result = await Promise.all(
        matches.map(async (match)=>{
            const minPriceTicket = await Ticket.findOne({
              where : {matchId: match.id},
              order : [["price","ASC"]],
              attributes : ["price"],
            });

            return {
              ...match.toJSON(),
              minPrice: minPriceTicket ? minPriceTicket.price : null,
            };
        })
      );
      return result;
};

export const getMatchById = async(matchId)=>{
    const match = await Match.findByPk(matchId);
    if(!match) {
        throw new Error("Can't find match ")
    }
    return match;
}

export const createMatch = async(data)=>{
    console.log(data);
    return await Match.create(data);
}

export const updateMatch = async (id, data) => {
  const [updatedCount] = await Match.update(data, { where: { id } });

  if (updatedCount === 0) {
    throw new Error(`Không tìm thấy trận đấu id: ${id}`);
  }

  return await Match.findByPk(id, {
    include: [
      { model: Team, as: "homeTeam", attributes: ["id", "name", "logo"] },
      { model: Team, as: "awayTeam", attributes: ["id", "name", "logo"] },
      { model: Stadium, attributes: ["id", "name"] },
    ],
  });
};


export const cancelMatch = async (id) => {
  const match = await Match.findByPk(id);
  if (!match) {
    throw new Error(`Không tìm thấy trận đấu id: ${id}`);
  }

  // Chỉ cho hủy nếu chưa kết thúc
  if (match.status === "finished") {
    throw new Error("Không thể hủy trận đã kết thúc");
  }

  match.status = "canceled";
  await match.save();

  return match;
};
