require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const Workspace = require('./workspace')(sequelize, Sequelize.DataTypes);
const Article = require('./article')(sequelize, Sequelize.DataTypes);
const ArticleVersion = require('./articleVersion')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  Workspace,
  Article,
  ArticleVersion,
  Comment,
  User
};
