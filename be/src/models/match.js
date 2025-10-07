import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Match = sequelize.define("Match", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false },
    matchDate: { type: DataTypes.DATE, allowNull: false },
    stadiumId: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: true,
});

Match.associate = (models) => {
    Match.belongsTo(models.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    Match.belongsTo(models.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Match.belongsTo(models.Stadium, { foreignKey: 'stadiumId' });
};

export default Match;