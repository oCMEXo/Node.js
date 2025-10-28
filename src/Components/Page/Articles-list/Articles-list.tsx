import  { useState } from "react";
import { Link } from "react-router-dom";
import "./Articles-list.css";

// Временные данные (mock)
const mockArticles = [
    {
        id: "1",
        title: "Getting Started with React",
        excerpt: "Learn the basics of React and how to build your first component.",
        author: "John Doe",
        date: "2024-01-15",
        category: "Tutorial",
    },
    {
        id: "2",
        title: "Advanced TypeScript Patterns",
        excerpt: "Explore advanced TypeScript patterns for better type safety.",
        author: "Jane Smith",
        date: "2024-01-20",
        category: "Advanced",
    },
    {
        id: "3",
        title: "CSS Grid Layout Guide",
        excerpt: "Master CSS Grid with practical examples and best practices.",
        author: "Mike Johnson",
        date: "2024-01-25",
        category: "Design",
    },
    {
        id: "4",
        title: "State Management in React",
        excerpt: "Compare different state management solutions for React applications.",
        author: "Sarah Williams",
        date: "2024-02-01",
        category: "Tutorial",
    },
];

export default function ArticlesListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...Array.from(new Set(mockArticles.map((a) => a.category)))];

    const filteredArticles = mockArticles.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
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
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === "All" ? "Все категории" : category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="articles-grid">
                {filteredArticles.map((article) => (
                    <Link to={`/articles/${article.id}`} key={article.id} className="article-card">                        <div className="article-category">{article.category}</div>
                        <h2 className="article-title">{article.title}</h2>
                        <p className="article-excerpt">{article.excerpt}</p>
                        <div className="article-meta">
                            <span className="article-author">{article.author}</span>
                            <span className="article-date">{article.date}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="no-results">
                    <p>Статьи не найдены. Попробуйте изменить критерии поиска.</p>
                </div>
            )}
        </div>
    );
}
