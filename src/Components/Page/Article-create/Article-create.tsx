import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Article-create.css";

export default function CreateArticlePage() {
    const navigate = useNavigate();
    const editorRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Tutorial");
    const [excerpt, setExcerpt] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = [ "Tutorial", "Advanced", "Design", "News", "Opinion"];

    const handleEditorInput = () => {
        if (editorRef.current) {
            editorRef.current.dataset.content = editorRef.current.innerHTML;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const content = editorRef.current?.innerHTML || "";


        const articleData = {
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            excerpt: excerpt.trim(),
            content,
        };

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articleData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error );
            }

            navigate("/articles");
        } catch (err: any) {
            console.error(err);
            setError(err.message );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-article-container">
            <div className="create-article-header">
                <Link to="/articles" className="back-link">
                    ← Отменить
                </Link>
                <div>
                    <h1>Создание новой статьи</h1>
                    <p className="page-subtitle">Заполните форму для публикации статьи</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="article-form">
                <div className="form-group">
                    <label htmlFor="title">Название статьи *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите название статьи..."
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="author">Имя автора *</label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Ваше имя..."
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категория *</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="excerpt">Краткое описание *</label>
                    <textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Краткое описание вашей статьи..."
                        required
                        className="form-textarea"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Содержание статьи *</label>
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleEditorInput}
                        className="wysiwyg-editor"
                        tabIndex={0}
                        suppressContentEditableWarning={true}
                        data-placeholder="Начните писать содержание статьи здесь..."
                    ></div>
                </div>

                {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

                <div className="form-actions">
                    <Link to="/articles" className="cancel-button">
                        Отменить
                    </Link>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={
                            loading ||
                            !title.trim() ||
                            !author.trim() ||
                            !excerpt.trim() ||
                            !(editorRef.current?.innerHTML.replace(/<(.|\n)*?>/g, "").trim())
                        }
                    >
                        {loading ? "Сохраняем..." : "Опубликовать статью"}
                    </button>
                </div>
            </form>
        </div>
    );
}
