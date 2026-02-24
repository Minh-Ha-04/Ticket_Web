import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Section = sequelize.define(
  "Section",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seatCount: { type: DataTypes.INTEGER, allowNull: false },
    stadiumId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    paranoid:true,
    tableName : "sections",
    freezeTableName : true
  }
);

Section.associate = (models) => {
  Section.belongsTo(models.Stadium, { foreignKey: "stadiumId", as: "stadium" });
  Section.hasMany(models.SectionMatch, {
    foreignKey: 'sectionId',
    as: 'sectionMatches',
    onDelete: 'CASCADE',
  });
  
};

export default Section;
