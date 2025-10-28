import './App.css'
import ArticlesListPage from "./Components/Page/Articles-list/Articles-list.tsx";
import {Route, Routes} from "react-router-dom";
import CreateArticlePage from "./Components/Page/Article-create/Article-create.tsx";

function App() {

    return (
        <Routes>
            <Route path="/" element={<ArticlesListPage/>}/>
            <Route path="/create" element={<CreateArticlePage/>}/>
        </Routes>
    )
}

export default App
