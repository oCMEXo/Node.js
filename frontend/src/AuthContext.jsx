import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const isAdmin = user?.role === "admin";
    const isAuthed = Boolean(token) && Boolean(user);

    const login = ({ token: t, user: u }) => {
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
    };

    const value = useMemo(
        () => ({ token, user, isAdmin, isAuthed, login, logout }),
        [token, user, isAdmin, isAuthed]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}

