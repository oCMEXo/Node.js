const express = require("express");
const path = require("path");
const workspaceRoutes = require("./routes/workspaceRoutes");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.redirect("/workspaces");
});

app.use("/workspaces", workspaceRoutes);
app.use("/", articleRoutes);
app.use("/", commentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
