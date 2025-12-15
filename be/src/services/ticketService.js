import models from "../models/index.js";
const { SectionMatch, Section } = models;

export const getTicketInfoByMatch = async (matchId) => {
  const sectionMatches = await SectionMatch.findAll({
    where: { matchId },
    include: [
      {
        model: Section,
        as: "section",
        attributes: ["id", "name"]
      }
    ]
  });

  return sectionMatches.map(sm => ({
    sectionId: sm.section.id,
    sectionName: sm.section.name,
    price: sm.price,
    totalSeats: sm.totalSeats,
    soldSeats: sm.totalSeats - sm.availableSeats,
    availableSeats: sm.availableSeats
  }));
};
