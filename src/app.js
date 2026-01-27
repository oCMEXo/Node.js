const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");



const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const auth = require("./middleware/auth");

const workspaceRoutes = require("./routes/workspaceRoutes");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uploadsDir = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use("/", authRoutes);

app.get("/", (req, res) => {
  if (!req.cookies?.token) return res.redirect("/login");
  res.redirect("/workspaces");
});

app.use(auth);

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

app.use("/workspaces", workspaceRoutes);
app.use("/", articleRoutes);
app.use("/", commentRoutes);
app.use("/", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

if (process.env.NODE_ENV === "test") {
    const testAuth = require("./middleware/testAuth");
    app.use(testAuth);
}


module.exports = app;
