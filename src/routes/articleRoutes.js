const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const articleController = require("../controllers/articleController");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
        cb(null, safeName);
    }
});

const upload = multer({ storage });

router.get("/workspaces/:workspaceId/articles", articleController.listByWorkspace);
router.get("/workspaces/:workspaceId/articles/new", articleController.newForm);
router.post(
    "/workspaces/:workspaceId/articles",
    upload.single("attachment"),
    articleController.create
);

router.get("/articles/:id", articleController.detail);
router.get("/articles/:id/edit", articleController.editForm);

router.post("/articles/:id", upload.single("attachment"), (req, res, next) => {
    const method = (req.body._method || "").toUpperCase();
    if (method === "PUT") {
        return articleController.update(req, res, next);
    }
    if (method === "DELETE") {
        return articleController.destroy(req, res, next);
    }
    res.status(400).send("Unsupported method");
});

router.get("/articles/:id/export", articleController.exportPdf);

module.exports = router;
