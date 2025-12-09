const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname);

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getFilePath(id) {
  return path.join(dataDir, id + ".json");
}

function listArticles() {
  ensureDir();
  const files = fs.readdirSync(dataDir).filter(name => name.endsWith(".json"));
  const result = [];
  files.forEach(name => {
    const filePath = path.join(dataDir, name);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.id === "string" && typeof parsed.title === "string") {
        result.push({ id: parsed.id, title: parsed.title });
      }
    } catch (e) {}
  });
  return result;
}

function readArticle(id) {
  ensureDir();
  const filePath = getFilePath(id);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    return null;
  }
}

function saveArticle(article) {
  ensureDir();
  const filePath = getFilePath(article.id);
  const raw = JSON.stringify(article, null, 2);
  fs.writeFileSync(filePath, raw, "utf8");
}

function generateId() {
  const now = new Date();
  const ts = now.toISOString().replace(/[-:TZ.]/g, "");
  const rnd = Math.floor(Math.random() * 100000);
  return ts + "-" + String(rnd).padStart(5, "0");
}

module.exports = {
  listArticles,
  readArticle,
  saveArticle,
  generateId
};
