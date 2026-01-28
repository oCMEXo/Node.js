require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres"
    }
);

const Workspace = require("./workspace")(sequelize, DataTypes);
const Article = require("./article")(sequelize, DataTypes);
const ArticleVersion = require("./articleVersion")(sequelize, DataTypes);
const Comment = require("./comment")(sequelize, DataTypes);
const User = require("./user")(sequelize, DataTypes);

Workspace.hasMany(Article, {
    foreignKey: "workspace_id",
    as: "articles"
});

Article.belongsTo(Workspace, {
    foreignKey: "workspace_id",
    as: "workspace"
});

Article.hasMany(ArticleVersion, {
    foreignKey: {
        name: "articleId",
        field: "article_id"
    },
    as: "versions"
});

ArticleVersion.belongsTo(Article, {
    foreignKey: {
        name: "articleId",
        field: "article_id"
    },
    as: "article"
});

Article.hasMany(Comment, {
    foreignKey: "articleId",
    as: "comments"
});
Comment.belongsTo(Article, {
    foreignKey: "articleId",
    as: "article"
});

User.hasMany(Article, {
    foreignKey: "creator_id",
    as: "articles"
});
Article.belongsTo(User, {
    foreignKey: "creator_id",
    as: "creator"
});

module.exports = {
    sequelize,
    Workspace,
    Article,
    ArticleVersion,
    Comment,
    User
};
