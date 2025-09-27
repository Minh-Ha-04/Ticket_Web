import sequelize from "../config/db";
import { DataTypes } from "sequelize";

import Match from "./match.js";
import Seat from "./seat.js";
import Booking from "./booking.js";
import Cart from "./cart.js";

const Ticket = sequelize.define("Ticket", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'sold','canceled'), allowNull: false, defaultValue: 'available' },
    matchId : { type: DataTypes.INTEGER, allowNull: false},
    seatId : { type: DataTypes.INTEGER, allowNull: false},
    bookingId : { type: DataTypes.INTEGER, allowNull: true},
    cartId : { type: DataTypes.INTEGER, allowNull: true},
}, {
    timestamps: true,
});

Ticket.belongsTo(Match, {foreignKey :'macthId'});
Ticket.belongsTo(Seat, {foreignKey :'seatId'});
Ticket.belongsTo(Booking, {foreignKey :'bookingId'});
Ticket.belongsTo(Cart, {foreignKey :'cartId'});

export default Ticket;