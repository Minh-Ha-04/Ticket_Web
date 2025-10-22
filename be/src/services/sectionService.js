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

// ➕ Tạo section và sinh ghế tương ứng
export const createSection = async (data) => {
  const { name, seatCount, price, stadiumId } = data;
  if (!name || !seatCount || !price || !stadiumId) {
    throw new Error("Thiếu dữ liệu bắt buộc!");
  }

  // Tạo section
  const section = await Section.create({ name, seatCount, price, stadiumId });

  // Tạo ghế cho section
  const seats = Array.from({ length: seatCount }, (_, i) => ({
    number: `${name}-${i + 1}`,
    sectionId: section.id,
  }));
  await Seat.bulkCreate(seats);

  return section;
};

// ✏️ Cập nhật section (bao gồm tên và số lượng ghế)
export const updateSection = async (id, data) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại!");

  const { name, seatCount } = data;
  const oldName = section.name;
  const oldSeatCount = section.seatCount;

  // Cập nhật section
  await section.update(data);

  // Nếu thay đổi số lượng ghế
  if (seatCount && seatCount !== oldSeatCount) {
    const currentSeats = await Seat.count({ where: { sectionId: id } });

    if (seatCount > currentSeats) {
      // Thêm ghế mới
      const diff = seatCount - currentSeats;
      const newSeats = Array.from({ length: diff }, (_, i) => ({
        number: `${section.name}-${currentSeats + i + 1}`,
        sectionId: section.id,
      }));
      await Seat.bulkCreate(newSeats);
    } else if (seatCount < currentSeats) {
      // Xóa bớt ghế dư
      const diff = currentSeats - seatCount;
      const seatsToDelete = await Seat.findAll({
        where: { sectionId: section.id },
        order: [["id", "DESC"]],
        limit: diff,
      });
      const seatIds = seatsToDelete.map((s) => s.id);
      await Seat.destroy({ where: { id: seatIds } });
    }
  }

  // Nếu đổi tên khu vực, cập nhật lại tên ghế
  if (name && name !== oldName) {
    const seats = await Seat.findAll({ where: { sectionId: section.id } });
    for (let i = 0; i < seats.length; i++) {
      seats[i].number = `${name}-${i + 1}`;
      await seats[i].save();
    }
  }

  return section;
};

// ❌ Xóa section (ghế sẽ tự động xóa do CASCADE)
export const deleteSection = async (id) => {
  const section = await Section.findByPk(id);
  if (!section) throw new Error("Section không tồn tại!");

  // Không cần gọi Seat.destroy() nữa
  await section.destroy();

  return { message: "Đã xóa khu vực và tất cả ghế liên quan." };
};
