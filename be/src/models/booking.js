import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Booking = sequelize.define("Booking", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId : { type: DataTypes.INTEGER, allowNull: false },
    bookingDate : { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status : { type: DataTypes.ENUM('pending','paid','canceled'), allowNull: false, defaultValue: 'pending' },
    totalPrice : { type: DataTypes.FLOAT, allowNull: false },
    matchId : { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: true,
    paranoid: true,
});

Booking.associate = (models) => {
    Booking.belongsTo(models.User,{foreignKey : 'userId',as : "user"});
    Booking.hasMany(models.Ticket, {
        foreignKey: "bookingId",
        as: "tickets",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    Booking.belongsTo(models.Match,{foreignKey : 'matchId',as : "match"});
};

export default Booking;