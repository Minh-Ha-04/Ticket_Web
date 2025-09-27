import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Section from "./section.js";

const Stadium = sequelize.define("Stadium", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    capacity : { type: DataTypes.INTEGER, allowNull: true },
    isHome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    timestamps: true,
});

Stadium.associations = (models) => {
    Stadium.hasMany(Section,{foreignKey : 'stadiumId'});
};

export default Stadium;