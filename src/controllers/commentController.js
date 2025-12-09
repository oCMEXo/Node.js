
const { Article, Comment } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const article = await Article.findByPk(articleId);
    if (!article) return res.status(404).send('Article not found');

    const author = (req.body.author || '').trim();
    const body = (req.body.body || '').trim();

    if (!author || !body) {
      return res.status(400).send('Author and body are required.');
    }

    await Comment.create({ author, body, articleId });

    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).send('Comment not found');
    const articleId = comment.articleId;
    await comment.destroy();
    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    next(err);
  }
};
