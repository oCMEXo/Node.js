import { Routes, Route, Navigate } from "react-router-dom";
import ArticlesListPage from "./Components/Page/Articles-list/Articles-list.tsx";
import CreateArticlePage from "./Components/Page/Article-create/Article-create.tsx";
import ArticleDetailPage from "./Components/Page/Article-detail/Artsicle-detail.tsx";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Navigate to="/articles" replace />} />
                <Route path="/articles" element={<ArticlesListPage />} />
                <Route path="/articles/create" element={<CreateArticlePage />} />
                <Route path="/articles/:id" element={<ArticleDetailPage />} />
            </Routes>

    );
}

export default App;
