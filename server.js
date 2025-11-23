const express = require('express');
const app = express();
PORT = process.env.PORT || 3000;

app.use(express.json());

let articles = [
    { id: 1, title: "First title", content: "Article to fist title" },
    { id: 2, title: "Second title", content: "Article to second title" },
];


app.get("/api/articles", (req, res) => {
    res.json(articles);
});

app.post("/api/articles", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "title and content import" });
    }

    const newArticle = {
        id: Date.now(),
        title,
        content,
    };

    articles.push(newArticle);
    res.status(201).json(newArticle);
});



app.put("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "incorrect id" });
    }

    const articleIndex = articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Not found" });
    }

    const { title, content } = req.body;
    if (!title && !content) {
        return res
            .status(400)
            .json({ error: "Needed one line: title or content" });
    }

    if (title) articles[articleIndex].title = title;
    if (content) articles[articleIndex].content = content;

    res.json(articles[articleIndex]);
});


app.delete("/api/articles/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Incorrect id" });
    }

    const articleIndex = articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }

    const deleted = articles[articleIndex];
    articles = articles.filter((a) => a.id !== id);

    res.json({ message: "Article deleted", article: deleted });
});

app.use((err, req, res) => {
    console.error(err);
    res
        .status(500)
        .json({ error });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
