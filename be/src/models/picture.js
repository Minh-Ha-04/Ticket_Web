import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Picture = sequelize.define("Picture", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.STRING, allowNull: false },   
  url: { type: DataTypes.STRING, allowNull: false },
  publicId: { type: DataTypes.STRING, allowNull: false }
});

export default Picture;