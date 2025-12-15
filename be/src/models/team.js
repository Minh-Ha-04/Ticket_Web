import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Team = sequelize.define("Team", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    logo : { type: DataTypes.STRING, allowNull: true },
    logoPublicId :{type: DataTypes.STRING, allowNull:true},
    shortname : { type: DataTypes.STRING, allowNull: true },
    stadiumId : { type: DataTypes.INTEGER, allowNull: true}
}, {
    timestamps: true,
});

Team.associate = (models) => {
    Team.belongsTo(models.Stadium, {
      foreignKey: 'stadiumId',
      as: 'stadium'
    });
  };
  

export default Team;