import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api, getUser, setToken, setUser } from "./api.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Articles from "./pages/Articles.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

function AdminRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUserState] = useState(getUser());
  const nav = useNavigate();

  useEffect(() => {
    // try to refresh user if token exists
    (async () => {
      try {
        const me = await api.me();
        setUser(me.user);
        setUserState(me.user);
      } catch {
        // ignore
      }
    })();
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserState(null);
    nav("/login");
  };

  return (
    <div style={{ maxWidth: 980, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Link to="/">Articles</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user?.role === "admin" && <Link to="/admin">User Management</Link>}
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
              <span>{user.email} ({user.role})</span>
              <button onClick={logout}>Logout</button>
            </span>
          ) : null}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Articles user={user} />} />
        <Route path="/login" element={<Login onAuth={(u, t) => { setUserState(u); setUser(u); setToken(t); nav("/"); }} />} />
        <Route path="/register" element={<Register onAuth={(u, t) => { setUserState(u); setUser(u); setToken(t); nav("/"); }} />} />
        <Route path="/admin" element={
          <AdminRoute user={user}>
            <AdminUsers user={user} />
          </AdminRoute>
        } />
      </Routes>
    </div>
  );
}
