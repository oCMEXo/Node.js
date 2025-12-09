const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  attachFile
} = require("../controllers/articlesController");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed. Only JPG, PNG and PDF are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

router.get("/", listArticles);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);
router.post("/:id/attachments", upload.single("attachment"), attachFile);

module.exports = router;
