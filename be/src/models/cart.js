import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Ticket from "./ticket.js";


const Cart = sequelize.define("Cart", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId : { type: DataTypes.INTEGER, allowNull: false },
    listTicketId : { type: DataTypes.JSON, allowNull: false },
    status : { type: DataTypes.ENUM('active', 'purchased','canceled'), allowNull: false, defaultValue: 'active' },
}, {
    timestamps: true,
});

Cart.associations = (models) => {
    Cart.hasMany(Ticket,{foreignKey : 'cartId'});
};

export default Cart;