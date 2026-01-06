const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const { signToken } = require("../auth/jwt");
const { isEmail, isStrongPassword } = require("../utils/validators");

function cookieOptions() {
  const secure = String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true";
  return { httpOnly: true, sameSite: "strict", secure };
}

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";
    if (!isEmail(email)) return res.status(400).json({ error: "invalid_email" });
    if (!isStrongPassword(password)) return res.status(400).json({ error: "weak_password" });

    const passwordHash = await bcrypt.hash(password, 12);
    const q = "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at";
    const r = await db.query(q, [email, passwordHash]);
    return res.status(201).json({ user: r.rows[0] });
  } catch (e) {
    if (String(e && e.code) === "23505") return res.status(409).json({ error: "email_taken" });
    return res.status(500).json({ error: "server_error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";
    if (!isEmail(email) || typeof password !== "string") return res.status(400).json({ error: "invalid_credentials" });

    const r = await db.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
    if (r.rowCount === 0) return res.status(401).json({ error: "invalid_credentials" });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const token = signToken({ sub: user.id, email: user.email });
    res.cookie("token", token, { ...cookieOptions(), maxAge: 1000 * 60 * 60 });
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions());
  return res.json({ ok: true });
});

module.exports = router;
