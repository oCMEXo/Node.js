import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export function AdminRoute({ children }) {
    const { isAuthed, isAdmin } = useAuth();
    const loc = useLocation();

    if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}
