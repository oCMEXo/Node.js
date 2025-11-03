import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Article-detail.css";

interface Article {
    id: string;
    title: string;
    author: string;
    date?: string;
    category: string;
    readTime?: string;
    content: string;
}

export default function ArticleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`http://localhost:8080/api/articles/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Статья не найдена");
                return res.json();
            })
            .then((data) => {
                setArticle(data.article);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="article-detail-container">Загрузка статьи...</div>;
    }

    if (error || !article) {
        return (
            <div className="article-detail-container">
                <div className="article-not-found">
                    <h1>Статья не найдена</h1>
                    <p>{error || "Запрашиваемая статья не существует или была удалена."}</p>
                    <Link to="/articles" className="back-link">
                        ← Вернуться к списку статей
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="article-detail-container">
            <Link to="/articles" className="back-link">
                ← Вернуться к списку статей
            </Link>

            <article className="article-detail">
                <header className="article-header">
                    <div className="article-category-badge">{article.category}</div>
                    <h1 className="article-title">{article.title}</h1>

                    <div className="article-metadata">
                        <div className="author-info">
                            <div className="author-avatar">{article.author}</div>
                            <div>
                                <div className="article-date">{article.date}</div>
                            </div>
                        </div>
                        <div className="read-time">{article.readTime}</div>
                    </div>
                </header>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <footer className="article-footer">


                    <div className="article-actions">
                        <button className="action-button">
                            <span>👍</span> Нравится
                        </button>
                        <button className="action-button">
                            <span>💬</span> Комментарий
                        </button>
                        <button className="action-button">
                            <span>🔖</span> Сохранить
                        </button>
                    </div>
                </footer>
            </article>
        </div>
    );
}
