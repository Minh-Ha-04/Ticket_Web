import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Booking from "./booking.js";

const Invoice = sequelize.define("Invoice", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    pdfUrl: { type: DataTypes.STRING, allowNull: true },
    bookingId : { type: DataTypes.INTEGER, allowNull: false}
}, {
    timestamps: true,
    paranoid: true,
    tableName : "invoices",
    freezeTableName : true
});

Invoice.associations = (models) => {
    Invoice.belongsTo(Booking,{foreignKey : 'bookingId'});
};

export default Invoice;