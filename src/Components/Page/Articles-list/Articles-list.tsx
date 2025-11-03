import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Articles-list.css";

export default function ArticlesListPage() {
    const [data, setData] = useState({ articles: [], status: "idle", error: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        setData(d => ({ ...d, status: "loading" }));
        fetch("http://localhost:8080/api/articles")
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(json => setData({ articles: json.articles || [], status: "done", error: null }))
            .catch(err => setData({ articles: [], status: "error", error: err.message }));
    }, []);

    const categoryOrder = ["Tutorial", "Advanced", "Design", "News", "Opinion"];
    const categories = ["All", ...categoryOrder.filter(cat => data.articles.some(a => a.category === cat))];

    const filteredArticles = data.articles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedArticles = [...filteredArticles].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        const safeIndexA = indexA === -1 ? categoryOrder.length : indexA;
        const safeIndexB = indexB === -1 ? categoryOrder.length : indexB;
        return safeIndexA - safeIndexB;
    });

    return (
        <div className="articles-container">
            <header className="articles-header">
                <div>
                    <h1>Управление статьями</h1>
                    <p className="page-description">Просмотр всех опубликованных статей</p>
                </div>
                <Link to="/articles/create" className="create-button">
                    Создать новую статью
                </Link>
            </header>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Поиск статей по названию или описанию..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="category-filters">
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            className={`category-button ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === "All" ? "Все категории" : category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="articles-grid">
                {sortedArticles.map(a => (
                    <Link to={`/articles/${a.id}`} key={a.id} className="article-card">
                        <div className="article-category">{a.category}</div>
                        <h2 className="article-title">{a.title}</h2>
                        <p className="article-excerpt">{a.excerpt}</p>
                        <div className="article-meta">
                            <span className="article-author">{a.author}</span>
                            <span className="article-date">{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {sortedArticles.length === 0 && (
                <div className="no-results">
                    <p>No result</p>
                </div>
            )}
        </div>
    );
}
