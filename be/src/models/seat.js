import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Seat = sequelize.define("Seat", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number : { type: DataTypes.STRING, allowNull: false },
    isAvailable : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sectionId : { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: true,
});

Seat.associate = (models) => {
    Seat.belongsTo(models.Section,{foreignKey : 'sectionId',as : 'section',    onDelete: "CASCADE",
        onUpdate: "CASCADE",});
    
};


export default Seat;