
const sequelize = require('../config/database');

const WorkspaceModel = require('./workspace');
const ArticleModel = require('./article');
const CommentModel = require('./comment');

const Workspace = WorkspaceModel(sequelize);
const Article = ArticleModel(sequelize);
const Comment = CommentModel(sequelize);

Workspace.hasMany(Article, {
  foreignKey: {
    name: 'workspaceId',
    field: 'workspace_id',
    allowNull: false
  },
  as: 'articles',
  onDelete: 'CASCADE'
});
Article.belongsTo(Workspace, {
  foreignKey: {
    name: 'workspaceId',
    field: 'workspace_id',
    allowNull: false
  },
  as: 'workspace'
});

Article.hasMany(Comment, {
  foreignKey: {
    name: 'articleId',
    field: 'article_id',
    allowNull: false
  },
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Article, {
  foreignKey: {
    name: 'articleId',
    field: 'article_id',
    allowNull: false
  },
  as: 'article'
});

module.exports = {
  sequelize,
  Workspace,
  Article,
  Comment
};
