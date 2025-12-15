import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Stadium = sequelize.define("Stadium", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    capacity : { type: DataTypes.INTEGER, allowNull: true },
    isHome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    tableName : "stadiums",
    timestamps: true,
});

Stadium.associate = (models) => {
    Stadium.hasMany(models.Section, {
      foreignKey: 'stadiumId',
      as: 'sections'
    });
  
    Stadium.hasMany(models.Match, {
      foreignKey: 'stadiumId',
      as: 'matches'
    });
  };
  

export default Stadium;