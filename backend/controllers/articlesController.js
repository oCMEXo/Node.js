const {
  listArticles,
  createArticle,
  findArticleById,
  updateArticle,
  deleteArticle
} = require("../data/articlesStore");

function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

function getArticleOrSendError(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid article id" });
    return null;
  }
  const article = findArticleById(id);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return null;
  }
  return article;
}

exports.getAll = (req, res) => {
  res.json(listArticles());
};

exports.create = (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!title || !content) {
    return res.status(400).json({
      error: "Both title and content are required to create an article"
    });
  }
  const article = createArticle(title, content);
  res.status(201).json(article);
};

exports.update = (req, res) => {
  const article = getArticleOrSendError(req, res);
  if (!article) {
    return;
  }
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!title && !content) {
    return res.status(400).json({
      error: "Provide at least one field (title or content) to update the article"
    });
  }
  updateArticle(article, title || undefined, content || undefined);
  res.json(article);
};

exports.remove = (req, res) => {
  const article = getArticleOrSendError(req, res);
  if (!article) {
    return;
  }
  deleteArticle(article);
  res.status(204).end();
};
