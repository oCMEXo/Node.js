require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { requireAuth, requireAuthPage } = require("./auth/middleware");
const authRoutes = require("./routes/auth");
const articlesRoutes = require("./routes/articles");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

const publicDir = path.join(__dirname, "public");

app.get("/", (req, res) => res.redirect("/login.html"));
app.get("/app.html", requireAuthPage, (req, res) => res.sendFile(path.join(publicDir, "app.html")));
app.use(express.static(publicDir));

app.use("/api", authRoutes);
app.get("/api/me", requireAuth, (req, res) => res.json({ user: req.user }));
app.use("/api/articles", requireAuth, articlesRoutes);

app.use((req, res) => res.status(404).json({ error: "not_found" }));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`http://localhost:${port}`));
