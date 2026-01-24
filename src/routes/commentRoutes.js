const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/articles/:articleId/comments", commentController.create);
router.post("/comments/:id", (req, res, next) => {
  if ((req.body._method || "").toUpperCase() === "DELETE") {
    return commentController.destroy(req, res, next);
  }
  res.status(400).send("Unsupported method");
});

module.exports = router;
