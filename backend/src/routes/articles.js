import express from "express";
import { db, nowIso } from "../db/db.js";
import { requireAuth } from "../middleware/auth.js";

export const articlesRouter = express.Router();

// LIST + SEARCH
articlesRouter.get("/", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  let rows;
  if (q) {
    rows = db.prepare(`
      SELECT a.*, u.email AS author_email
      FROM articles a JOIN users u ON u.id=a.author_id
      WHERE LOWER(a.title) LIKE ? OR LOWER(a.body) LIKE ?
      ORDER BY a.id DESC
    `).all(`%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare(`
      SELECT a.*, u.email AS author_email
      FROM articles a JOIN users u ON u.id=a.author_id
      ORDER BY a.id DESC
    `).all();
  }

  res.json(rows);
});

function canEdit(user, article) {
  return user.role === "admin" || article.author_id === user.id;
}

articlesRouter.post("/", requireAuth, (req, res) => {
  const { title, body } = req.body;
  const ts = nowIso();
  const info = db.prepare(`
    INSERT INTO articles (title,body,author_id,created_at,updated_at)
    VALUES (?,?,?,?,?)
  `).run(title, body, req.user.id, ts, ts);

  res.json(db.prepare("SELECT * FROM articles WHERE id=?").get(info.lastInsertRowid));
});

articlesRouter.put("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const article = db.prepare("SELECT * FROM articles WHERE id=?").get(id);
  if (!article) return res.status(404).json({ message: "Not found" });
  if (!canEdit(req.user, article)) return res.status(403).json({ message: "Forbidden" });

  const { title, body } = req.body;
  db.prepare("UPDATE articles SET title=?, body=?, updated_at=? WHERE id=?")
    .run(title || article.title, body || article.body, nowIso(), id);

  res.json(db.prepare("SELECT * FROM articles WHERE id=?").get(id));
});
