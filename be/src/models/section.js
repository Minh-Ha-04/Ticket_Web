import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Section = sequelize.define("Section", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seatCount : { type: DataTypes.INTEGER, allowNull: false },
    price : { type: DataTypes.FLOAT, allowNull: false },
    stadiumId : { type: DataTypes.INTEGER, allowNull: false}
}, {
    timestamps: true,
});

Section.associate= (models) => {
    Section.belongsTo(models.Stadium,{foreignKey : 'stadiumId',as : 'stadium'});
    Section.hasMany(models.Seat,{foreignKey : 'sectionId',as :'seats'});
};

export default Section;