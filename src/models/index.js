const sequelize = require("../config/database");

const WorkspaceModel = require("./workspace");
const ArticleModel = require("./article");
const ArticleVersionModel = require("./articleVersion");
const CommentModel = require("./comment");

const Workspace = WorkspaceModel(sequelize);
const Article = ArticleModel(sequelize);
const ArticleVersion = ArticleVersionModel(sequelize);
const Comment = CommentModel(sequelize);

Workspace.hasMany(Article, {
  foreignKey: {
    name: "workspaceId",
    field: "workspace_id",
    allowNull: false
  },
  as: "articles",
  onDelete: "CASCADE"
});
Article.belongsTo(Workspace, {
  foreignKey: {
    name: "workspaceId",
    field: "workspace_id",
    allowNull: false
  },
  as: "workspace"
});

Article.hasMany(ArticleVersion, {
  foreignKey: {
    name: "articleId",
    field: "article_id",
    allowNull: false
  },
  as: "versions",
  onDelete: "CASCADE"
});
ArticleVersion.belongsTo(Article, {
  foreignKey: {
    name: "articleId",
    field: "article_id",
    allowNull: false
  },
  as: "article"
});

Article.hasMany(Comment, {
  foreignKey: {
    name: "articleId",
    field: "article_id",
    allowNull: false
  },
  as: "comments",
  onDelete: "CASCADE"
});
Comment.belongsTo(Article, {
  foreignKey: {
    name: "articleId",
    field: "article_id",
    allowNull: false
  },
  as: "article"
});

module.exports = {
  sequelize,
  Workspace,
  Article,
  ArticleVersion,
  Comment
};
