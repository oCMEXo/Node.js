const { DataTypes } = require("sequelize");
const sequelize = require("../db");

module.exports = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.ENUM("admin", "user"), defaultValue: "user" }
});