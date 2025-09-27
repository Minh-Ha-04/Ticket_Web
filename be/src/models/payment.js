import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Booking from "./booking.js";

const Payment = sequelize.define("Payment", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), allowNull: false, defaultValue: 'pending' },
    transactionId: { type: DataTypes.STRING, allowNull: true, unique: true },
    bookingId : { type: DataTypes.INTEGER, allowNull: false}
}, {
    timestamps: true,
});

Payment.associations = (models) => {
    Payment.belongsTo(Booking,{foreignKey : 'bookingId'});
};

export default Payment;