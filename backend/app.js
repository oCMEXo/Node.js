const express = require("express");
const cors = require("cors");
const path = require("path");
const articlesRouter = require("./routes/articles");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

app.use("/api/articles", articlesRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
