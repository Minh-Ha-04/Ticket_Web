import model from "../models/index.js";
const { Seat, Section } = model;

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

export const createSeat = async (data) => {
  return await Seat.create(data);
};

export const updateSeat = async (id, data) => {
  const seat = await Seat.findByPk(id);
  if (!seat) throw new Error("Can't find seat");
  await seat.update(data);
  return seat;
};
