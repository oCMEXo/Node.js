const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Article = sequelize.define("Article", {
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
});

User.hasMany(Article, { foreignKey: "createdBy" });
Article.belongsTo(User, { foreignKey: "createdBy" });

module.exports = Article;