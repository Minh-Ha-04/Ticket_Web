import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Section from "./section.js";

const Seat = sequelize.define("Seat", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number : { type: DataTypes.STRING, allowNull: false },
    isAvailable : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sectionId : { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: true,
});

Seat.belongsTo(Section,{foreignKey : 'sectionId'});

export default Seat;