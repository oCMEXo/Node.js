import express from "express";
import { db, nowIso } from "../db/db.js";
import { requireAuth } from "../middleware/auth.js";
import { articleCreateSchema, articleUpdateSchema } from "../validation/schemas.js";

export const articlesRouter = express.Router();

articlesRouter.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.title, a.body, a.author_id, a.created_at, a.updated_at, u.email AS author_email
    FROM articles a
    JOIN users u ON u.id = a.author_id
    ORDER BY a.id DESC
  `).all();
  res.json(rows);
});

articlesRouter.post("/", requireAuth, (req, res) => {
  const parsed = articleCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { title, body } = parsed.data;
  const ts = nowIso();
  const info = db.prepare(`
    INSERT INTO articles (title, body, author_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, body, req.user.id, ts, ts);

  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(article);
});

function canEditArticle(user, article) {
  const isOwner = article.author_id === user.id;
  const isAdmin = user.role === "admin";
  return isOwner || isAdmin;
}

articlesRouter.put("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
  if (!article) return res.status(404).json({ message: "Not found" });

  if (!canEditArticle(req.user, article)) {
    return res.status(403).json({ message: "You cannot edit this article" });
  }

  const parsed = articleUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { title, body } = parsed.data;
  const newTitle = title ?? article.title;
  const newBody = body ?? article.body;

  db.prepare("UPDATE articles SET title = ?, body = ?, updated_at = ? WHERE id = ?")
    .run(newTitle, newBody, nowIso(), id);

  const updated = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
  res.json(updated);
});

articlesRouter.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
  if (!article) return res.status(404).json({ message: "Not found" });

  if (!canEditArticle(req.user, article)) {
    return res.status(403).json({ message: "You cannot delete this article" });
  }

  db.prepare("DELETE FROM articles WHERE id = ?").run(id);
  res.json({ ok: true });
});
