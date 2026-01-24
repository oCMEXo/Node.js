const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.PGDATABASE || "versioned_articles",
  process.env.PGUSER || "postgres",
  process.env.PGPASSWORD || "postgres",
  {
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    dialect: "postgres",
    logging: false
  }
);

module.exports = sequelize;
