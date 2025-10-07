import models from "../models/index.js";
const {Match,Team,Stadium} = models;

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

export const getMatchbyId = async(matchId)=>{
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

export const updateMatch = async(id,data)=>{
    const [updatedCount] = await Match.update(data, { where: { id } });
  if (updatedCount === 0) {
    throw new Error(`Không tìm thấy trận đấu id: ${id}`);
  }

  // Sau khi update, lấy lại bản ghi đầy đủ (đã include associations)
  const updatedMatch = await Match.findByPk(id, {
    include: [
      { model: Team, as: "homeTeam", attributes: ["id", "name", "logo"] },
      { model: Team, as: "awayTeam", attributes: ["id", "name", "logo"] },
      { model: Stadium, attributes: ["id", "name"] },
    ],
  });

  return updatedMatch;
}

export const deleteMatch = async(id)=>{
    const match = await Match.findByPk(id);
    if(!match) {
        throw new Error(`Cant'find match id : ${id}`)
    }
    return match.destroy();
}