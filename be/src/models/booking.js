import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import User from "./user.js";

const Booking = sequelize.define("Booking", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId : { type: DataTypes.INTEGER, allowNull: false },
    bookingDate : { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status : { type: DataTypes.ENUM('pending', 'confirmed','canceled'), allowNull: false, defaultValue: 'pending' },
    totalPrice : { type: DataTypes.FLOAT, allowNull: false },
}, {
    timestamps: true,
});

Booking.associations = (models) => {
    Booking.belongsTo(User,{foreignKey : 'userId'});
};

export default Booking;