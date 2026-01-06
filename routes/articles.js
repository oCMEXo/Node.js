const express = require("express");
const db = require("../db");
const { nonEmptyText } = require("../utils/validators");

const router = express.Router();

router.get("/", async (req, res) => {
  const q = "SELECT a.id, a.title, a.body, a.created_at, u.email AS author_email FROM articles a JOIN users u ON u.id = a.author_id WHERE a.author_id = $1 ORDER BY a.created_at DESC";
  const r = await db.query(q, [req.user.sub]);
  return res.json({ items: r.rows });
});

router.post("/", async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  if (!nonEmptyText(title, 120)) return res.status(400).json({ error: "invalid_title" });
  if (!nonEmptyText(body, 5000)) return res.status(400).json({ error: "invalid_body" });

  const q = "INSERT INTO articles (author_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, body, created_at";
  const r = await db.query(q, [req.user.sub, String(title).trim(), String(body).trim()]);
  return res.status(201).json({ item: r.rows[0] });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM articles WHERE id = $1 AND author_id = $2 RETURNING id";
  const r = await db.query(q, [id, req.user.sub]);
  if (r.rowCount === 0) return res.status(404).json({ error: "not_found" });
  return res.json({ ok: true });
});

module.exports = router;
