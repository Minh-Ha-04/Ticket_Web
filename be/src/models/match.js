import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Match = sequelize.define("Match", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false },
    matchDate: { type: DataTypes.DATE, allowNull: false },
    stadiumId: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true,
});

Match.associations = (models) => {
    Match.belongsTo(Team,{as : 'homeTeam',foreignKey : 'homeTeamId'});
    Match.belongsTo(Team,{as : 'awayTeam', foreignKey : 'awayTeamId'});
    Match.belongsTo(Stadium,{foreignKey : 'stadiumId'});
};


export default Match;