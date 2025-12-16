import models from "../models/index.js";
const { Section, Stadium } = models;

export const getAllSections = async (stadiumId) => {
  return await Section.findAll({
    where: { stadiumId },
    include: [
      {
        model: Stadium,
        as: "stadium",
        attributes: ["id", "name"],
      },
    ],
    order: [["name", "ASC"]],
  });
};

export const createSection = async (data) => {
  const { name, stadiumId, seatCount} = data;

  if (!name || !stadiumId || seatCount == null) {
    throw new Error("Thiếu name, stadiumId hoặc seatCount");
  }

  return await Section.create({ name, stadiumId, seatCount});
};


export const updateSection = async (id, data) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại");

  await section.update({
    name: data.name ?? section.name,
  });

  return section;
};

export const deleteSection = async (id) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại");

  await section.destroy();
  return { message: "Đã xóa khu vực" };
};
