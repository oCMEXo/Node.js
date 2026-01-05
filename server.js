require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const { signToken, authMiddleware, authPage } = require("./auth");
const { isEmail, isStrongPassword } = require("./validators");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const publicDir = path.join(__dirname, "public");

app.get("/", (req, res) => res.redirect("/login.html"));
app.get("/logic.html", authPage, (req, res) => res.sendFile(path.join(publicDir, "logic.html")));
app.use(express.static(publicDir));

function setTokenCookie(res, token) {
  const secure = String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    maxAge: 1000 * 60 * 60
  });
}

app.post("/api/register", async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";
    if (!isEmail(email)) return res.status(400).json({ error: "invalid_email" });
    if (!isStrongPassword(password)) return res.status(400).json({ error: "weak_password" });

    const hash = await bcrypt.hash(password, 12);
    const q = "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at";
    const r = await db.query(q, [email, hash]);
    return res.status(201).json({ user: r.rows[0] });
  } catch (e) {
    if (String(e && e.code) === "23505") return res.status(409).json({ error: "email_taken" });
    return res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/login", async (req, res) => {
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
    setTokenCookie(res, token);
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/logout", (req, res) => {
  const secure = String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true";
  res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure });
  return res.json({ ok: true });
});

app.get("/api/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.get("/api/logic", authMiddleware, async (req, res) => {
  return res.json({
    ok: true,
    message: "Protected logic page data",
    user: req.user,
    now: new Date().toISOString()
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
