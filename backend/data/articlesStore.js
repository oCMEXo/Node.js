let nextId = 1;
const articles = [];

function listArticles() {
  return articles.slice();
}

function createArticle(title, content) {
  const article = {
    id: nextId++,
    title,
    content
  };
  articles.push(article);
  return article;
}

function findArticleById(id) {
  return articles.find(a => a.id === id) || null;
}

function updateArticle(article, title, content) {
  if (typeof title === "string") {
    article.title = title;
  }
  if (typeof content === "string") {
    article.content = content;
  }
  return article;
}

function deleteArticle(article) {
  const index = articles.indexOf(article);
  if (index !== -1) {
    articles.splice(index, 1);
  }
}

module.exports = {
  listArticles,
  createArticle,
  findArticleById,
  updateArticle,
  deleteArticle
};
