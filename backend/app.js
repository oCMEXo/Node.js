const express = require("express");
const path = require("path");
const multer = require("multer");
const articlesRouter = require("./routes/articles");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendDir = path.join(__dirname, "..", "frontend");
const uploadsDir = path.join(__dirname, "uploads");

app.use(express.static(frontendDir));
app.use("/uploads", express.static(uploadsDir));

app.use("/api/articles", articlesRouter);

app.use((err, req, res, next) => {
  if (err && err.name === "MulterError") {
    return res.status(400).json({
      error: "File upload error",
      details: err.message
    });
  }
  if (err && err.message === "File type not allowed. Only JPG, PNG and PDF are allowed.") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
