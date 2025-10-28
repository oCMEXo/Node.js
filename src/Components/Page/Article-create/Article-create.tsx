import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Article-create.css";

export default function CreateArticlePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Tutorial");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const editorRef = useRef(null);

    const categories = ["Tutorial", "Advanced", "Design", "News", "Opinion"];

    const handleFormat = (command, value) => {
        // execCommand устарел, но для простого демо можно использовать
        if (document && typeof document.execCommand === "function") {
            document.execCommand(command, false, value);
            editorRef.current?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const articleData = {
            title: title.trim(),
            category,
            excerpt: excerpt.trim(),
            content: editorRef.current?.innerHTML || "",
            author: author.trim(),
            date: new Date().toISOString().split("T")[0],
        };

        // Простая проверка
        if (!articleData.title || !articleData.author || !articleData.excerpt || !articleData.content) {
            alert("Пожалуйста, заполните все обязательные поля!");
            return;
        }

        console.log("Article submitted:", articleData);
        alert("✅ Статья успешно создана! (демо-версия без сервера)");

        // Очистка формы
        setTitle("");
        setExcerpt("");
        setAuthor("");
        setContent("");
        if (editorRef.current) editorRef.current.innerHTML = "";

        // Переход обратно к списку статей
        navigate("/");
    };

    const handleEditorInput = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="create-article-container">
            <div className="create-article-header">
                <Link to="/" className="back-link">
                    ← Отменить
                </Link>
                <div>
                    <h1>Создание новой статьи</h1>
                    <p className="page-subtitle">Заполните форму для публикации статьи</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="article-form">
                {/* Основная информация */}
                <div className="form-section">
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
                                required
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
                </div>

                {/* Редактор контента */}
                <div className="form-section">
                    <label>Содержание статьи *</label>

                    <div className="editor-toolbar">
                        <div className="toolbar-group">
                            <button
                                type="button"
                                onClick={() => handleFormat("bold")}
                                className="toolbar-button"
                                title="Жирный"
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("italic")}
                                className="toolbar-button"
                                title="Курсив"
                            >
                                <em>I</em>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("underline")}
                                className="toolbar-button"
                                title="Подчеркнутый"
                            >
                                <u>U</u>
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        <div className="toolbar-group">
                            <button
                                type="button"
                                onClick={() => handleFormat("formatBlock", "h2")}
                                className="toolbar-button"
                                title="Заголовок 2"
                            >
                                H2
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("formatBlock", "h3")}
                                className="toolbar-button"
                                title="Заголовок 3"
                            >
                                H3
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("formatBlock", "p")}
                                className="toolbar-button"
                                title="Параграф"
                            >
                                P
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        <div className="toolbar-group">
                            <button
                                type="button"
                                onClick={() => handleFormat("insertUnorderedList")}
                                className="toolbar-button"
                                title="Маркированный список"
                            >
                                • Список
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("insertOrderedList")}
                                className="toolbar-button"
                                title="Нумерованный список"
                            >
                                1. Список
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        <div className="toolbar-group">
                            <button
                                type="button"
                                onClick={() => {
                                    const url = prompt("Введите URL:");
                                    if (url) handleFormat("createLink", url);
                                }}
                                className="toolbar-button"
                                title="Вставить ссылку"
                            >
                                🔗
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat("removeFormat")}
                                className="toolbar-button"
                                title="Очистить форматирование"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

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

                {/* Кнопки */}
                <div className="form-actions">
                    <Link to="/" className="cancel-button">
                        Отменить
                    </Link>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!title || !author || !excerpt || !content}
                    >
                        Опубликовать статью
                    </button>
                </div>
            </form>
        </div>
    );
}
