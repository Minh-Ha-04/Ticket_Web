import models, { sequelize } from "../models/index.js";

const { Section, SectionMatch } = models;

export const createSectionMatches = async (matchId, sections) => {
  return await sequelize.transaction(async (t) => {
    const result = [];

    for (const sec of sections) {
      // tránh tạo trùng
      const [sm, created] = await SectionMatch.findOrCreate({
        where: {
          matchId,
          sectionId: sec.sectionId,
        },
        defaults: {
          price: sec.price,
          totalSeats: sec.totalSeats,
          availableSeats: sec.totalSeats,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      // nếu đã tồn tại thì update (admin chỉnh lại)
      if (!created) {
        sm.price = sec.price;
        sm.totalSeats = sec.totalSeats;
        sm.availableSeats = Math.min(
          sm.availableSeats,
          sec.totalSeats
        );
        await sm.save({ transaction: t });
      }

      result.push(sm);
    }

    return result;
  });
};
export const getSectionsByMatch = async (matchId) => {
  return await SectionMatch.findAll({
    where: { matchId },
    include: [
      {
        model: Section,
        as: "section",
        attributes: ["id", "name"],
      },
    ],
  });
};

export const holdSeats = async (sectionMatchId, quantity, transaction) => {
  const sm = await SectionMatch.findByPk(sectionMatchId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!sm) {
    throw new Error("SectionMatch không tồn tại");
  }

  if (sm.availableSeats < quantity) {
    throw new Error(`Chỉ còn ${sm.availableSeats} vé`);
  }

  sm.availableSeats -= quantity;
  await sm.save({ transaction });

  return sm;
};

export const updateSectionMatches = async (matchId, sections) => {
  const updates = [];

  for (const s of sections) {
    const sectionMatch = await SectionMatch.findOne({
      where: { matchId, sectionId: s.sectionId },
    });
    if (!sectionMatch) {
      throw new Error(`Không tìm thấy SectionMatch cho sectionId ${s.sectionId}`);
    }
    if (s.price != null) sectionMatch.price = s.price;
    updates.push(sectionMatch.save());
  }

  return await Promise.all(updates);
};
