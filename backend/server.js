const express = require("express");
const cors = require("cors");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

let articles = [
    { id: 1, title: "First article", content: "Text of the first article", attachments: [] },
    { id: 2, title: "Second article", content: "Text of the second article", attachments: [] },
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, Date.now() + "-" + safeName);
    },
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

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
});

function sendNotification(payload) {
    io.emit("notification", payload);
}

app.get("/api/articles", (req, res) => {
    res.json(articles);
});

app.get("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid article id" });
    }

    const article = articles.find((a) => a.id === id);
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
});

app.post("/api/articles", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Both title and content are required" });
    }

    const newArticle = {
        id: Date.now(),
        title,
        content,
        attachments: [],
    };

    articles.push(newArticle);

    sendNotification({
        type: "article_created",
        articleId: newArticle.id,
        message: `New article "${newArticle.title}" was created`,
    });

    res.status(201).json(newArticle);
});

app.put("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid article id" });
    }

    const articleIndex = articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }

    const { title, content } = req.body;
    if (!title && !content) {
        return res.status(400).json({ error: "Provide at least one field: title or content" });
    }

    if (title) articles[articleIndex].title = title;
    if (content) articles[articleIndex].content = content;

    const updated = articles[articleIndex];

    sendNotification({
        type: "article_updated",
        articleId: id,
        message: `Article "${updated.title}" was updated`,
    });

    res.json(updated);
});

app.delete("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid article id" });
    }

    const articleIndex = articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }

    const deleted = articles[articleIndex];

    if (deleted.attachments && deleted.attachments.length > 0) {
        deleted.attachments.forEach((att) => {
            const fullPath = path.join(__dirname, att.diskPath || "");
            if (fs.existsSync(fullPath)) {
                fs.unlink(fullPath, () => {});
            }
        });
    }

    articles = articles.filter((a) => a.id !== id);

    sendNotification({
        type: "article_deleted",
        articleId: id,
        message: `Article "${deleted.title}" was deleted`,
    });

    res.json({ message: "Article deleted", article: deleted });
});

app.post(
    "/api/articles/:id/attachments",
    upload.single("file"),
    (req, res) => {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(400).json({ error: "Invalid article id" });
        }

        const article = articles.find((a) => a.id === id);
        if (!article) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(404).json({ error: "Article not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        const attachment = {
            id: Date.now(),
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            url: `/uploads/${req.file.filename}`,
            diskPath: req.file.filename,
        };

        if (!article.attachments) {
            article.attachments = [];
        }
        article.attachments.push(attachment);

        sendNotification({
            type: "attachment_added",
            articleId: id,
            message: `New file "${attachment.originalName}" was attached to article "${article.title}"`,
        });

        res.status(200).json({
            message: "File successfully uploaded",
            attachment,
        });
    }
);

app.use((err, req, res) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: "File upload error",
            details: err.message,
        });
    }

    if (err.message === "File type not allowed. Only JPG, PNG and PDF are allowed.") {
        return res.status(400).json({
            error: err.message,
        });
    }

    res.status(500).json({
        error: "Internal server error",
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
