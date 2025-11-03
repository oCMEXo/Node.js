import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_DIR = path.resolve("./data");



async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch (err) {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
});

app.get("/api/articles", async (req, res) => {
    try {
        await ensureDataDir();
        const files = await fs.readdir(DATA_DIR);
        const articles = [];

        for (const file of files) {
            if (!file.endsWith(".json")) continue;
            const content = await fs.readFile(path.join(DATA_DIR, file), "utf8");
            const parsed = JSON.parse(content);

            articles.push({
                id: parsed.id,
                title: parsed.title,
                author: parsed.author,
                category: parsed.category,
                excerpt: parsed.excerpt || (parsed.content ? parsed.content.slice(0, 120) : ""),
                createdAt: parsed.createdAt,
            });
        }

        articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ articles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error"  });
    }
});

app.get("/api/articles/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const filePath = path.join(DATA_DIR, `${id}.json`);
        const content = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(content);
        res.json({ article: parsed });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "error"  });
    }
});

app.post("/api/articles", async (req, res) => {
    try {
        const { title, content, category, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "error" });
        }

        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const excerpt = content.replace(/<[^>]+>/g, "").slice(0, 200);

        const article = {
            id,
            title,
            content,
            excerpt,
            createdAt,
            category: category || "Tutorial",
            author: author || "Anonymous",
        };

        console.log(article);
        await ensureDataDir();
        await fs.writeFile(path.join(DATA_DIR, `${id}.json`), JSON.stringify(article, null, 2), "utf8");

        res.status(201).json({ article });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }
});

app.use(express.static(path.join(process.cwd(), "client", "build")));
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});



app.listen(PORT, async () => {
    await ensureDataDir();
    console.log(`Server started on port ${PORT}`);
});

