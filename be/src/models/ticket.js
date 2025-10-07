import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Ticket = sequelize.define("Ticket", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'sold','canceled'), allowNull: false, defaultValue: 'available' },
    posterUrl: { type: DataTypes.STRING, allowNull: true },
    matchId : { type: DataTypes.INTEGER, allowNull: false},
    seatId : { type: DataTypes.INTEGER, allowNull: false},
    bookingId : { type: DataTypes.INTEGER, allowNull: true},
    cartId : { type: DataTypes.INTEGER, allowNull: true},
}, {
    timestamps: true,
    indexes: [
        { fields: ["matchId"] },
        { fields: ["seatId"] },
      ],
});

Ticket.associate = (models) => {
    Ticket.belongsTo(models.Match, {foreignKey :'matchId',as:'match'});
    Ticket.belongsTo(models.Seat, {foreignKey :'seatId',as:'seat'});
    Ticket.belongsTo(models.Booking, {foreignKey :'bookingId',as:'booking'});
    Ticket.belongsTo(models.Cart, {foreignKey :'cartId',as:'cart'});
}

export default Ticket;