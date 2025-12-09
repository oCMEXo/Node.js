const { listArticles, readArticle, saveArticle, generateId } = require("../data/articlesStore");

function validateArticlePayload(body) {
  const errors = {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!title) {
    errors.title = "Title is required";
  }
  if (!content) {
    errors.content = "Content is required";
  }
  return { title, content, errors };
}

exports.getAll = (req, res) => {
  const items = listArticles();
  res.json(items);
};

exports.getOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Article id is required" });
  }
  const article = readArticle(id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.json(article);
};

exports.create = (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: "Invalid request body",
      errors: {
        title: "Title is required",
        content: "Content is required"
      }
    });
  }
  const { title, content, errors } = validateArticlePayload(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      errors
    });
  }
  const now = new Date().toISOString();
  const article = {
    id: generateId(),
    title,
    content,
    createdAt: now
  };
  try {
    saveArticle(article);
    res.status(201).json(article);
  } catch (e) {
    res.status(500).json({ error: "Failed to save article" });
  }
};
