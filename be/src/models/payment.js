import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define("Payment", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM("momo", "vnpay", "credit_card"),allowNull: false,},
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), allowNull: false, defaultValue: 'pending' },
    orderId: { type: DataTypes.STRING, allowNull: true, unique: true },
    bookingId : { type: DataTypes.INTEGER, allowNull: false},
    userId: { type: DataTypes.INTEGER, allowNull: false },
    discountId : {type: DataTypes.INTEGER, allowNull:true}
}, {
    timestamps: true,
    paranoid:true,
});

Payment.associate = (models) => {
    Payment.belongsTo(models.Booking,{foreignKey : 'bookingId',as:'booking'});
    Payment.belongsTo(models.Discount , {foreignKey :'discountId', as :"discount"});
    Payment.belongsTo(models.User , {foreignKey:'userId', as : "user"});
};



export default Payment;