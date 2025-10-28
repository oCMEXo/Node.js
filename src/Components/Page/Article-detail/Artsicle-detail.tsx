"use client"

import { use } from "react"
import {Link} from "react-router-dom";
import "./Article-detail.css"

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

      <h3>Your First Component</h3>
      <p>Creating a component in React is straightforward. Here's a simple example:</p>
      <pre><code>function Welcome() {
  return &lt;h1&gt;Hello, World!&lt;/h1&gt;;
}</code></pre>

      <h3>Next Steps</h3>
      <p>Now that you understand the basics, you can start building more complex applications. Explore hooks, state management, and routing to take your React skills to the next level.</p>
    `,
    },
    "2": {
        id: "2",
        title: "Advanced TypeScript Patterns",
        author: "Jane Smith",
        date: "2024-01-20",
        category: "Advanced",
        readTime: "8 min read",
        content: `
      <h2>Mastering TypeScript</h2>
      <p>TypeScript adds static typing to JavaScript, making your code more robust and maintainable. Let's explore some advanced patterns.</p>

      <h3>Generics</h3>
      <p>Generics allow you to create reusable components that work with multiple types:</p>
      <pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}</code></pre>

      <h3>Utility Types</h3>
      <p>TypeScript provides several utility types to facilitate common type transformations:</p>
      <ul>
        <li><strong>Partial&lt;T&gt;:</strong> Makes all properties optional</li>
        <li><strong>Required&lt;T&gt;:</strong> Makes all properties required</li>
        <li><strong>Pick&lt;T, K&gt;:</strong> Constructs a type by picking properties</li>
        <li><strong>Omit&lt;T, K&gt;:</strong> Constructs a type by omitting properties</li>
      </ul>

      <h3>Conditional Types</h3>
      <p>Conditional types help you create types that depend on other types, enabling powerful type-level programming.</p>
    `,
    },
    "3": {
        id: "3",
        title: "CSS Grid Layout Guide",
        author: "Mike Johnson",
        date: "2024-01-25",
        category: "Design",
        readTime: "6 min read",
        content: `
      <h2>Understanding CSS Grid</h2>
      <p>CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.</p>

      <h3>Basic Grid Setup</h3>
      <p>To create a grid container, simply set display to grid:</p>
      <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</code></pre>

      <h3>Grid Properties</h3>
      <ul>
        <li><strong>grid-template-columns:</strong> Define column tracks</li>
        <li><strong>grid-template-rows:</strong> Define row tracks</li>
        <li><strong>gap:</strong> Set spacing between grid items</li>
        <li><strong>grid-area:</strong> Position items in specific areas</li>
      </ul>

      <h3>Responsive Grids</h3>
      <p>Use auto-fit and minmax to create responsive grids that adapt to different screen sizes without media queries.</p>
    `,
    },
    "4": {
        id: "4",
        title: "State Management in React",
        author: "Sarah Williams",
        date: "2024-02-01",
        category: "Tutorial",
        readTime: "7 min read",
        content: `
      <h2>Managing State in React Applications</h2>
      <p>State management is crucial for building scalable React applications. Let's compare different approaches.</p>

      <h3>Built-in Solutions</h3>
      <ul>
        <li><strong>useState:</strong> Perfect for local component state</li>
        <li><strong>useReducer:</strong> Better for complex state logic</li>
        <li><strong>Context API:</strong> Share state across components</li>
      </ul>

      <h3>External Libraries</h3>
      <p>For larger applications, consider these popular state management libraries:</p>
      <ul>
        <li><strong>Redux:</strong> Predictable state container with time-travel debugging</li>
        <li><strong>Zustand:</strong> Lightweight and simple state management</li>
        <li><strong>Jotai:</strong> Primitive and flexible state management</li>
      </ul>

      <h3>Choosing the Right Solution</h3>
      <p>Start simple with built-in hooks. Only introduce external libraries when your application's complexity demands it.</p>
    `,
    },
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const article = mockArticlesData[id]

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
        )
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

                <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

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
    )
}
