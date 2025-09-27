import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Stadium from "./stadium.js";
import Seat from "./seat.js";

const Section = sequelize.define("Section", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seatCount : { type: DataTypes.INTEGER, allowNull: false },
    price : { type: DataTypes.FLOAT, allowNull: false },
    stadiumId : { type: DataTypes.INTEGER, allowNull: false}
}, {
    timestamps: true,
});

Section.associations = (models) => {
    Section.belongsTo(Stadium,{foreignKey : 'stadiumId'});
    Section.hasMany(Seat,{foreignKey : 'sectionId'});
};

export default Section;