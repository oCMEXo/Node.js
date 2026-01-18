import { Routes, Route } from "react-router-dom";
import { Nav } from "./Nav";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { UserManagementPage } from "./UserManagementPage";

export default function App() {
    return (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <UserManagementPage />
                        </AdminRoute>
                    }
                />

                {/* пример для будущих страниц */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <div style={{ maxWidth: 1100, margin: "28px auto", padding: "0 18px" }}>
                                <div style={{ background: "white", borderRadius: 18, padding: 18 }}>
                                    Profile page
                                </div>
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<HomePage />} />
            </Routes>
        </>
    );
}
