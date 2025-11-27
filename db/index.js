// db/index.js
const { Sequelize } = require('sequelize');

// если хочешь, можешь оставить dotenv и тут тоже, это не помешает
// require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, // тут должна быть строка
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

// временная проверка:
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);

module.exports = sequelize;
