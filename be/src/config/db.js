import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: "+07:00",
    dialectOptions: {
    dateStrings: true, 
    typeCast: true,
    },
    logging: false,
});

export default sequelize;