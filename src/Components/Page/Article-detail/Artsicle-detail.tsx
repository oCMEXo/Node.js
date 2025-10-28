import { useParams, Link } from "react-router-dom";
import "./Article-detail.css";

// Mock data for full articles
const mockArticlesData: Record<string, any> = {
    "1": {
        id: "1",
        title: "Getting Started with React",
        author: "John Doe",
        date: "2024-01-15",
        category: "Tutorial",
        readTime: "5 min read",
        content: `
      <h2>Introduction to React</h2>
      <p>React is a powerful JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular tools for frontend development.</p>
      <h3>Why Choose React?</h3>
      <ul>
        <li><strong>Component-Based Architecture:</strong> Build encapsulated components that manage their own state.</li>
        <li><strong>Virtual DOM:</strong> React uses a virtual DOM to optimize rendering performance.</li>
        <li><strong>Rich Ecosystem:</strong> Access to thousands of libraries and tools.</li>
        <li><strong>Strong Community:</strong> Large community support and extensive documentation.</li>
      </ul>
    `,
    },
    "2": {
        id: "2",
        title: "Advanced TypeScript Patterns",
        author: "Jane Smith",
        date: "2024-01-20",
        category: "Advanced",
        readTime: "8 min read",
        content: `<h2>Mastering TypeScript</h2><p>...</p>`,
    },
    // другие статьи...
};

export default function ArticleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const article = id ? mockArticlesData[id] : null;

    if (!article) {
        return (
            <div className="article-detail-container">
                <div className="article-not-found">
                    <h1>Статья не найдена</h1>
                    <p>Запрашиваемая статья не существует или была удалена.</p>
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
                            <div className="author-avatar">{article.author[0]}</div>
                            <div>
                                <div className="author-name">{article.author}</div>
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
                    <div className="article-tags">
                        <span className="tag">React</span>
                        <span className="tag">JavaScript</span>
                        <span className="tag">Web Development</span>
                    </div>

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
