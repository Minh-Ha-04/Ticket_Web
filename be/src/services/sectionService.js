import models from '../models/index.js';
const { Seat, Stadium, Section } = models;

// 🧱 Lấy tất cả section của 1 sân
export const getAllSections = async (stadiumId) => {
  return await Section.findAll({
    where: { stadiumId },
    include: [
      {
        model: Stadium,
        as: "stadium",
        attributes: ["name"],
      },
    ],
    order: [["name", "ASC"]],
  });
};

export const createSection = async (data) => {
  const { name, seatCount, price, stadiumId } = data;
  if (!name || !seatCount || !price || !stadiumId) {
    throw new Error("Thiếu dữ liệu bắt buộc!");
  }
  const section = await Section.create({ name, seatCount, price, stadiumId });

  const seats = Array.from({ length: seatCount }, (_, i) => ({
    number: `${section.name}-${i + 1}`,
    sectionId: section.id,
  }));

  await Seat.bulkCreate(seats);

  return section;
};

export const updateSection = async (id, data) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại!");
  return await section.update(data);
};

export const deleteSection = async (id) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại!");
  await Seat.destroy({ where: { sectionId: id } });
  await section.destroy();
  return { message: "Đã xóa khu vực và ghế liên quan." };
};
