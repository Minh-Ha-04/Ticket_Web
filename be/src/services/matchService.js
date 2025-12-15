import { Op } from "sequelize";
import models from "../models/index.js";

const { Match, Team, Stadium,Section,SectionMatch } = models;



export const getAllMatches= async () => {

  const matches = await Match.findAll({
    where: { status : {[Op.ne] : "canceled"}},
    include: [
      { model: Team, as: "homeTeam", attributes: ["id", "name", "logo"] },
      { model: Team, as: "awayTeam", attributes: ["id", "name", "logo"] },
      { model: Stadium, attributes: ["id", "name"] },
    ],
    order: [["matchDate", "ASC"]],
  });

  const result = await Promise.all(
    matches.map(async (match) => {
      const sectionMatch = await SectionMatch.findOne({
        where: { matchId: match.id },
        order: [[ "price", "ASC"]],
        attributes: ["price"],
      });

      return {
        ...match.toJSON(),
        minPrice: sectionMatch ? sectionMatch.price : null,
      };
    })
  );

  return result;
};

// Lấy trận theo id
export const getMatchById = async (matchId) => {
  const match = await Match.findByPk(matchId, {
    include: [
      { model: Team, as: "homeTeam", attributes: ["id", "name", "logo"] },
      { model: Team, as: "awayTeam", attributes: ["id", "name", "logo"] },
      { model: Stadium, attributes: ["id", "name"] },
    ],
  });

  if (!match) throw new Error("Can't find match");

  return match;
};

// Tạo trận và tự động tạo SectionMatch
export const createMatch = async (data) => {
  const { stadiumId, ...matchData } = data;

  const match = await Match.create({
    ...matchData,
    stadiumId, 
  });

  const sections = await Section.findAll({ where: { stadiumId } });

  const sectionMatchesData = sections.map((sec) => ({
    matchId: match.id,
    sectionId: sec.id,
    totalSeats: sec.seatCount,
    availableSeats: sec.seatCount,
    price : 0,
  }));

  await SectionMatch.bulkCreate(sectionMatchesData);

  return match;
};


// Cập nhật trận
export const updateMatch = async (id, data) => {
  const [updatedCount] = await Match.update(data, { where: { id } });
  if (updatedCount === 0) throw new Error(`Không tìm thấy trận đấu id: ${id}`);

  return await Match.findByPk(id, {
    include: [
      { model: Team, as: "homeTeam", attributes: ["id", "name", "logo"] },
      { model: Team, as: "awayTeam", attributes: ["id", "name", "logo"] },
      { model: Stadium, attributes: ["id", "name"] },
    ],
  });
};

// Hủy trận
export const cancelMatch = async (id) => {
  const match = await Match.findByPk(id);
  if (!match) throw new Error(`Không tìm thấy trận đấu id: ${id}`);
  if (match.status === "finished") throw new Error("Không thể hủy trận đã kết thúc");

  match.status = "canceled";
  await match.save();

  return match;
};
