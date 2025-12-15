import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const SectionMatch = sequelize.define("SectionMatch", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price :{
    type :DataTypes.INTEGER,
    allowNull: false
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['matchId', 'sectionId']
    }
  ]
});

// Associations
SectionMatch.associate = (models) => {
        SectionMatch.belongsTo(models.Section, { foreignKey: "sectionId", as: "section" });
        SectionMatch.belongsTo(models.Match, { foreignKey: "matchId", as: "match" });
        SectionMatch.hasMany(models.Ticket, { as: 'tickets', foreignKey: 'sectionMatchId' });
};
export default SectionMatch;
