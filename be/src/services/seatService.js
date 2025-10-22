import models from "../models/index.js";
const { Seat, Section } = models;

export const getSeatsInSection = async (sectionId) => {
  return await Seat.findAll({
    where: { sectionId },
    include: [
      {
        model: Section,
        as: "section",
        attributes: ["name"],
      },
    ],
  });
};
