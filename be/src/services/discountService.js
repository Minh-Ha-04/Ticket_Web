import models from "../models/index.js";
import { Op, col } from "sequelize";
const {Discount} = models;

export const createDiscount = async (data) => {

      const { code, discountType, value, maxUsage, isActive, matchId } = data;
      if (!code || !value || !matchId) {
        return res.status(400).json({ message: "Thiếu thông tin mã giảm giá" });
      }
  
      const existing = await Discount.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
      }
  
      const discount = await Discount.create({
        code,
        discountType,
        value,
        maxUsage,
        isActive,
        matchId,
      });
      return discount;
  };
  
export const deleteDiscount = async (id) => {
    const discount = await Discount.findByPk(id); // cần await
    if (!discount) throw new Error("Mã giảm giá không tồn tại");
    return await discount.destroy();
};

export const getDiscountsInMatch = async (matchId) => {
    return await Discount.findAll({ where: { matchId } });
};

export const validateDiscount = async (code , matchId) => {
  const discount = await Discount.findOne({
      where: {
          code,
          matchId,
          isActive: true,
          usedCount: { [Op.lt]: col("maxUsage") },
      },
  });

  if (!discount) return null;
  return discount;
};

export const incrementUsage = async (discountId) => {
    const discount = await Discount.findByPk(discountId);
    if (discount) {
      discount.usedCount += 1;
      await discount.save();
    }
};
  