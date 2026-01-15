import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = "http://localhost:3001";

export function UserManagementPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return users;
        return users.filter((u) => (u.email || "").toLowerCase().includes(s));
    }, [users, q]);

    const load = async () => {
        setErr("");
        setOk("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            setErr(e.message || "Error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const changeRole = async (id, role) => {
        setErr("");
        setOk("");
        setSavingId(id);
        try {
            const res = await fetch(`${API_BASE}/api/users/${id}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role }),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(txt || `Update failed (${res.status})`);
            }

            const updated = await res.json();
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setOk("Role updated ✔");
            setTimeout(() => setOk(""), 1200);
        } catch (e) {
            setErr(e.message || "Error updating role");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div style={wrap}>
            <div style={headerCard}>
                <div>
                    <h1 style={h1}>User Management</h1>
                    <p style={muted}>Admins can view all users and update roles.</p>
                </div>

                <div style={actions}>
                    <div style={searchWrap}>
                        <span style={searchIcon}>⌕</span>
                        <input
                            style={search}
                            placeholder="Search by email…"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <button onClick={load} style={ghostBtn} disabled={loading}>
                        Refresh
                    </button>
                </div>
            </div>

            {err && <div style={alert("danger")}>{err}</div>}
            {ok && <div style={alert("success")}>{ok}</div>}

            <div style={tableCard}>
                {loading ? (
                    <div style={skeletonWrap}>
                        <div style={skeletonLine} />
                        <div style={skeletonLine} />
                        <div style={skeletonLine} />
                    </div>
                ) : (
                    <table style={table}>
                        <thead>
                        <tr>
                            <th style={th}>Email</th>
                            <th style={th}>Role</th>
                            <th style={th}>Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((u) => (
                            <tr key={u.id} style={tr}>
                                <td style={td}>
                                    <div style={{ fontWeight: 900 }}>{u.email}</div>
                                    <div style={{ fontSize: 12, color: "#64748b" }}>ID: {u.id}</div>
                                </td>

                                <td style={td}>
                                    <span style={roleBadge(u.role === "admin")}>{u.role}</span>
                                </td>

                                <td style={td}>
                                    <select
                                        style={select}
                                        value={u.role}
                                        disabled={savingId === u.id}
                                        onChange={(e) => changeRole(u.id, e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                    {savingId === u.id && <span style={saving}>Saving…</span>}
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ padding: 18, color: "#64748b", fontWeight: 800 }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const wrap = { maxWidth: 1100, margin: "28px auto", padding: "0 18px" };
const headerCard = {
    background: "white",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    boxShadow: "0 16px 50px rgba(2,6,23,0.08)",
    border: "1px solid rgba(2,6,23,0.06)",
};
const h1 = { margin: 0, fontSize: 22, letterSpacing: -0.2 };
const muted = { margin: "6px 0 0", color: "#6b7280", fontSize: 13 };
const actions = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const searchWrap = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f1f5f9",
    border: "1px solid rgba(2,6,23,0.06)",
    borderRadius: 12,
    padding: "8px 10px",
};
const searchIcon = { fontSize: 12, opacity: 0.6, fontWeight: 900 };
const search = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    width: 220,
};
const ghostBtn = {
    border: "1px solid rgba(2,6,23,0.10)",
    background: "white",
    padding: "9px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
};
const alert = (type) => ({
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: 12,
    border: `1px solid ${type === "danger" ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
    background: type === "danger" ? "rgba(239,68,68,0.10)" : "rgba(34,197,94,0.10)",
    color: type === "danger" ? "#991b1b" : "#065f46",
});
const tableCard = {
    marginTop: 14,
    background: "white",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 16px 50px rgba(2,6,23,0.08)",
    border: "1px solid rgba(2,6,23,0.06)",
};
const table = { width: "100%", borderCollapse: "collapse" };
const th = {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: 12,
    fontWeight: 900,
    color: "#64748b",
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    borderBottom: "1px solid rgba(2,6,23,0.06)",
};
const tr = { borderBottom: "1px solid rgba(2,6,23,0.06)" };
const td = { padding: "14px 16px", verticalAlign: "middle" };
const select = {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(2,6,23,0.12)",
    fontWeight: 900,
};
const saving = { marginLeft: 10, fontSize: 12, fontWeight: 900, color: "#64748b" };
const roleBadge = (isAdmin) => ({
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    color: isAdmin ? "#065f46" : "#1e3a8a",
    background: isAdmin ? "rgba(34,197,94,0.15)" : "rgba(96,165,250,0.18)",
    border: `1px solid ${isAdmin ? "rgba(34,197,94,0.25)" : "rgba(96,165,250,0.25)"}`,
});
const skeletonWrap = { padding: 16, display: "grid", gap: 10 };
const skeletonLine = {
    height: 16,
    borderRadius: 999,
    background: "linear-gradient(90deg, #eef2ff 0%, #f8fafc 40%, #eef2ff 100%)",
};
