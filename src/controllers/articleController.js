
const path = require('path');
const fs = require('fs');
const { Workspace, Article, Comment } = require('../models');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

exports.listByWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');

    const workspaces = await Workspace.findAll({ order: [['name', 'ASC']] });

    const articles = await Article.findAll({
      where: { workspaceId },
      order: [['created_at', 'DESC']],
      include: [{ model: Comment, as: 'comments', attributes: ['id'] }]
    });

    const articlesWithCount = articles.map(a => ({
      id: a.id,
      title: a.title,
      created_at: a.created_at,
      comment_count: a.comments.length
    }));

    res.render('articles', { workspace, workspaces, articles: articlesWithCount });
  } catch (err) {
    next(err);
  }
};

exports.newForm = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.params.workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');
    res.render('article_form', { workspace, article: null });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');

    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();

    if (!title || !body) {
      return res.status(400).send('Title and body are required.');
    }

    let attachmentFilename = null;
    if (req.file) {
      attachmentFilename = req.file.filename;
    }

    await Article.create({
      title,
      body,
      workspaceId,
      attachmentFilename
    });

    res.redirect(`/workspaces/${workspaceId}/articles`);
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByPk(articleId, {
      include: [
        { model: Workspace, as: 'workspace' },
        { model: Comment, as: 'comments', order: [['created_at', 'ASC']] }
      ]
    });
    if (!article) return res.status(404).send('Article not found');

    const workspaces = await Workspace.findAll({ order: [['name', 'ASC']] });

    res.render('article_detail', {
      article,
      workspace: article.workspace,
      workspaces,
      comments: article.comments
    });
  } catch (err) {
    next(err);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{ model: Workspace, as: 'workspace' }]
    });
    if (!article) return res.status(404).send('Article not found');
    res.render('article_form', { workspace: article.workspace, article });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).send('Article not found');

    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();

    if (!title || !body) {
      return res.status(400).send('Title and body are required.');
    }

    if (req.file) {
      if (article.attachmentFilename) {
        const oldPath = path.join(uploadsDir, article.attachmentFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      article.attachmentFilename = req.file.filename;
    }

    article.title = title;
    article.body = body;
    await article.save();

    res.redirect(`/articles/${article.id}`);
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).send('Article not found');

    const workspaceId = article.workspaceId;

    if (article.attachmentFilename) {
      const filePath = path.join(uploadsDir, article.attachmentFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await article.destroy();
    res.redirect(`/workspaces/${workspaceId}/articles`);
  } catch (err) {
    next(err);
  }
};
