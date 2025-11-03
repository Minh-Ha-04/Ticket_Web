import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Discount = sequelize.define(
  "Discount",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountType: {
      type: DataTypes.ENUM("percent", "amount"),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxUsage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    matchId : {
      type : DataTypes.INTEGER,
      allowNull : true,
    }
  },
  {
    timestamps: true,
  }
);

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
