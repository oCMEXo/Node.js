import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function Nav() {
    const { user, isAdmin, isAuthed, logout } = useAuth();

    return (
        <header style={styles.header}>
            <div style={styles.inner}>
                <Link to="/" style={styles.brand}>
                    RBAC<span style={{ opacity: 0.7 }}>•</span>Panel
                </Link>

                <nav style={styles.nav}>
                    <NavLink to="/" style={navLinkStyle}>Home</NavLink>

                    {isAdmin && (
                        <NavLink to="/admin/users" style={navLinkStyle}>
                            User Management
                        </NavLink>
                    )}
                </nav>

                <div style={styles.right}>
                    {isAuthed ? (
                        <>
                            <div style={styles.userPill} title={user?.email || ""}>
                                <span style={styles.dot(isAdmin)} />
                                <span style={styles.userText}>
                  {user?.email || "User"} • {user?.role}
                </span>
                            </div>

                            <button onClick={logout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={styles.loginBtn}>Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

function navLinkStyle({ isActive }) {
    return {
        ...styles.link,
        background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
        border: isActive ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
    };
}

const styles = {
    header: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "linear-gradient(180deg, #0b1220 0%, #0b1220 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
    },
    inner: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
    brand: {
        color: "white",
        textDecoration: "none",
        fontWeight: 800,
        letterSpacing: 0.3,
        fontSize: 16,
    },
    nav: { display: "flex", gap: 10, marginLeft: 8 },
    link: {
        color: "rgba(255,255,255,0.88)",
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
    },
    right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 },
    userPill: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.88)",
        maxWidth: 320,
    },
    dot: (isAdmin) => ({
        width: 8,
        height: 8,
        borderRadius: 999,
        background: isAdmin ? "#22c55e" : "#60a5fa",
        boxShadow: `0 0 0 4px ${isAdmin ? "rgba(34,197,94,0.15)" : "rgba(96,165,250,0.15)"}`,
    }),
    userText: { fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" },
    logoutBtn: {
        background: "rgba(239,68,68,0.90)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.10)",
        padding: "8px 12px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12,
    },
    loginBtn: {
        background: "rgba(255,255,255,0.08)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.10)",
        padding: "8px 12px",
        borderRadius: 10,
        textDecoration: "none",
        fontWeight: 800,
        fontSize: 12,
    },
};
