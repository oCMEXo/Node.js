import { useAuth } from "./AuthContext";

export function HomePage() {
    const { isAuthed, user } = useAuth();

    return (
        <div style={wrap}>
            <div style={card}>
                <h1 style={h1}>RBAC Demo</h1>
                <p style={muted}>
                    Admin can access <b>User Management</b> and change roles. Users cannot see or open that page.
                </p>

                <div style={grid}>
                    <div style={miniCard}>
                        <div style={kicker}>Current session</div>
                        {isAuthed ? (
                            <div>
                                <div style={big}>{user.email}</div>
                                <div style={pill(user.role === "admin")}>{user.role}</div>
                            </div>
                        ) : (
                            <div style={big}>Not logged in</div>
                        )}
                    </div>

                    <div style={miniCard}>
                        <div style={kicker}>Tip</div>
                        <div style={big}>Go to Login</div>
                        <div style={mutedSmall}>and set admin/user to test navigation & access.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const wrap = { maxWidth: 1100, margin: "28px auto", padding: "0 18px" };
const card = {
    background: "white",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 16px 50px rgba(2,6,23,0.08)",
    border: "1px solid rgba(2,6,23,0.06)",
};
const h1 = { margin: 0, fontSize: 24, letterSpacing: -0.2 };
const muted = { color: "#6b7280", marginTop: 10, lineHeight: 1.5 };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 };
const miniCard = {
    borderRadius: 16,
    padding: 16,
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    border: "1px solid rgba(2,6,23,0.06)",
};
const kicker = { fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase" };
const big = { marginTop: 8, fontSize: 16, fontWeight: 900, color: "#0f172a" };
const mutedSmall = { marginTop: 6, fontSize: 12, color: "#6b7280" };
const pill = (isAdmin) => ({
    marginTop: 10,
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    color: isAdmin ? "#065f46" : "#1e3a8a",
    background: isAdmin ? "rgba(34,197,94,0.15)" : "rgba(96,165,250,0.18)",
    border: `1px solid ${isAdmin ? "rgba(34,197,94,0.25)" : "rgba(96,165,250,0.25)"}`,
});
