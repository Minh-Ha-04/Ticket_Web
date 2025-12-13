import models, { sequelize } from "../models/index.js";
import { Op, col } from "sequelize";
const {Discount} = models;

export const createDiscount = async (data) => {

      const { code, discountType, value, maxUsage, isActive, matchId } = data;
      if (!code || !value || !matchId) {
        throw new Error("Thiếu thông tin mã giảm giá");
      }
  
      const existing = await Discount.findOne({ where: { code } });
      if (existing) {
        throw new Error("Mã giảm giá đã tồn tại ")
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
    const discount = await Discount.findByPk(id);
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

  if (!discount) throw new Error("Mã giảm giá không hợp lệ hoặc đã hết lượt áp dụng");
  return discount;
};

export const incrementUsage = async (discountId) =>{
  return await sequelize.transaction(async (t) => {
    const discount = await Discount.findByPk(discountId,{
      lock : true,
      transaction : t,
    });
    if (!discount) throw new Error("Không tồn tại discount này");
    if(discount.usedCount >= discount.maxUsage ) {
      throw new Error ("Mã giảm giá hết lượt ");
    }

    discount.usedCount +=1;
    await discount.save({transaction : t});
  });
};