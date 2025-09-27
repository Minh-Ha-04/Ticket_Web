import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Match = sequelize.define("Match", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    homeTeam: { type: DataTypes.STRING, allowNull: false },
    awayTeam: { type: DataTypes.STRING, allowNull: false },
    matchDate: { type: DataTypes.DATE, allowNull: false },
    stadiumId: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true,
});

Match.belongsTo(Team,{as : 'homeTeam',foreignKey : 'homeTeamId'});
Match.belongsTo(Team,{as : 'awayTeam', foreignKey : 'awayTeam'});
Match.belongsTo(Stadium,{foreignKey : 'stadiumId'});



export default Match;