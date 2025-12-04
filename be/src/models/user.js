import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const User = sequelize.define("User", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role : { type: DataTypes.ENUM('user','admin'),allowNull: false, defaultValue: 'user' },
    phone : { type: DataTypes.STRING, allowNull: true },
    isActive : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: true,
});

User.associations = (models) => {
    User.hasMany(models.Booking,{foreignKey : 'userId',as:'bookings'});
};

export default User;