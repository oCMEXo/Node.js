const path = require("path");
const fs = require("fs");
const { sendNotification } = require("../services/notifications");

const uploadsDir = path.join(__dirname, "..", "uploads");

const articles = [];
let nextId = 1;

function findArticleIndex(id) {
  return articles.findIndex(a => a.id === id);
}

exports.listArticles = (req, res) => {
  res.json(articles);
};

exports.createArticle = (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  const article = {
    id: nextId++,
    title,
    content,
    attachments: []
  };
  articles.push(article);
  sendNotification({
    type: "article_created",
    articleId: article.id,
    message: `Article "${article.title}" created`
  });
  res.status(201).json(article);
};

exports.updateArticle = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid article id." });
  }
  const index = findArticleIndex(id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found." });
  }
  const title = typeof req.body.title === "string" ? req.body.title.trim() : null;
  const content = typeof req.body.content === "string" ? req.body.content.trim() : null;
  if (!title && !content) {
    return res.status(400).json({ error: "Nothing to update." });
  }
  if (title) {
    articles[index].title = title;
  }
  if (content) {
    articles[index].content = content;
  }
  sendNotification({
    type: "article_updated",
    articleId: articles[index].id,
    message: `Article "${articles[index].title}" updated`
  });
  res.json(articles[index]);
};

exports.deleteArticle = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid article id." });
  }
  const index = findArticleIndex(id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found." });
  }
  const article = articles[index];
  if (article.attachments && article.attachments.length > 0) {
    article.attachments.forEach(att => {
      if (att.diskPath && fs.existsSync(att.diskPath)) {
        try {
          fs.unlinkSync(att.diskPath);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  articles.splice(index, 1);
  sendNotification({
    type: "article_deleted",
    articleId: id,
    message: `Article "${article.title}" deleted`
  });
  res.status(204).end();
};

exports.attachFile = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: "Invalid article id." });
  }
  const index = findArticleIndex(id);
  if (index === -1) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(404).json({ error: "Article not found." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Attachment file is required." });
  }
  const file = req.file;
  const attachment = {
    id: `${articles[index].id}-${Date.now()}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    url: `/uploads/${file.filename}`,
    diskPath: file.path
  };
  articles[index].attachments.push(attachment);
  sendNotification({
    type: "attachment_added",
    articleId: articles[index].id,
    message: `Attachment added to article "${articles[index].title}"`
  });
  res.status(201).json(attachment);
};
