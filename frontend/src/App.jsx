import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Articles from "./pages/Articles.jsx";
import Admin from "./pages/Admin.jsx";
import { api } from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.me().then(r => setUser(r.user)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles Platform</h1>
        <nav className="flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Articles</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="text-blue-600 hover:underline">User Management</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Articles />} />
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}
