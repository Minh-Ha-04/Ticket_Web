import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Discount = sequelize.define("Discount", {
  code: DataTypes.STRING,
  discountType: DataTypes.ENUM("percent", "amount"),
  value: DataTypes.FLOAT,
  maxUsage: DataTypes.INTEGER,
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  matchId: DataTypes.INTEGER,
}, {
  paranoid: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["code", "matchId"],
    },
  ],
    tableName : "discounts",
    freezeTableName : true
});


Discount.associate = (models) => {
  Discount.hasMany(models.Payment, {
    foreignKey: "discountId",
    as: "payments",
  });
  Discount.belongsTo(models.Match,{
    foreignKey : "matchId", as : "match"
  })
};

export default Discount;
