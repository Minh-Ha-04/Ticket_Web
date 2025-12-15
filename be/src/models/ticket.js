import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Ticket = sequelize.define("Ticket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  code: { type: DataTypes.STRING, unique: true },

  sectionMatchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('held','sold', 'used', 'canceled'),
    defaultValue: 'held'
  }
  }, { timestamps: true });
  
  Ticket.associate = (models) => {
    Ticket.belongsTo(models.SectionMatch, { foreignKey: 'sectionMatchId', as: 'sectionMatch' });
    Ticket.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
  };
  

export default Ticket;