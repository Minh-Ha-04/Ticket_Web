import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Match = sequelize.define("Match", {
    id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false },
    matchDate: { type: DataTypes.DATE, allowNull: false },
    stadiumId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
        type: DataTypes.ENUM('upcoming','ongoing','finished','canceled'
        ),
        allowNull: false,
        defaultValue: 'upcoming',
      },
    isTicketCreated: {type :DataTypes.BOOLEAN,allowNull :false,defaultValue:false},
    poster: { type: DataTypes.STRING, allowNull: true },
    posterPublicId : {type :DataTypes.STRING, allowNull :true}
}, {
    timestamps: true,
    paranoid : true,
});

Match.associate = (models) => {
    Match.belongsTo(models.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    Match.belongsTo(models.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Match.belongsTo(models.Stadium, { foreignKey: 'stadiumId' });
    Match.hasMany(models.Ticket, { foreignKey: 'matchId', as: 'tickets' });
    Match.hasMany(models.Discount, {foreignKey : 'matchId', as: 'discounts'});
};

export default Match;