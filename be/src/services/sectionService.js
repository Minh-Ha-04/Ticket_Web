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
  const { name, stadiumId } = data;

  if (!name || !stadiumId) {
    throw new Error("Thiếu name hoặc stadiumId");
  }

  return await Section.create({ name, stadiumId });
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
