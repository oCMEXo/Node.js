import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";



const LOGIN_URL = "http://localhost:3001/api/auth/login";

export function LoginPage() {
    const { login, isAuthed } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();
    const from = loc.state?.from || "/";
    const [mode, setMode] = useState("demo");
    const [email, setEmail] = useState("admin@test.com");
    const [password, setPassword] = useState("password");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (isAuthed) nav(from, { replace: true });
    }, [isAuthed, nav, from]);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");

        if (mode === "demo") {
            setErr("Demo mode: use the buttons below (Admin/User).");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Login failed");
            }

            const data = await res.json();
            login(data);
            nav(from, { replace: true });
        } catch (e2) {
            setErr(e2.message || "Login error");
        } finally {
            setLoading(false);
        }
    };

    const demo = (role) => {
        login({
            token: "DEMO_TOKEN",
            user: { id: 1, email: role === "admin" ? "admin@test.com" : "user@test.com", role },
        });
        nav(from, { replace: true });
    };

    return (
        <div style={wrap}>
            <div style={card}>
                <div style={top}>
                    <div>
                        <h1 style={h1}>Login</h1>
                        <p style={muted}>Choose demo role or connect to your backend auth endpoint.</p>
                    </div>

                    <div style={tabs}>
                        <button onClick={() => setMode("demo")} style={tabBtn(mode === "demo")}>Demo</button>
                        <button onClick={() => setMode("api")} style={tabBtn(mode === "api")}>API</button>
                    </div>
                </div>

                <form onSubmit={submit} style={{ marginTop: 16 }}>
                    <div style={field}>
                        <label style={label}>Email</label>
                        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div style={field}>
                        <label style={label}>Password</label>
                        <input
                            style={input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {err && <div style={error}>{err}</div>}

                    <button disabled={loading} style={primaryBtn} type="submit">
                        {loading ? "Signing in..." : mode === "api" ? "Sign in" : "Use demo buttons below"}
                    </button>
                </form>

                <div style={divider} />

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => demo("admin")} style={demoBtn(true)}>Demo as Admin</button>
                    <button onClick={() => demo("user")} style={demoBtn(false)}>Demo as User</button>
                </div>
            </div>
        </div>
    );
}

const wrap = { maxWidth: 520, margin: "34px auto", padding: "0 18px" };
const card = {
    background: "white",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 16px 50px rgba(2,6,23,0.08)",
    border: "1px solid rgba(2,6,23,0.06)",
};
const top = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" };
const h1 = { margin: 0, fontSize: 22, letterSpacing: -0.2 };
const muted = { margin: "8px 0 0", color: "#6b7280", fontSize: 13, lineHeight: 1.4 };
const tabs = { display: "flex", background: "#f1f5f9", padding: 4, borderRadius: 999 };
const tabBtn = (active) => ({
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    background: active ? "white" : "transparent",
    boxShadow: active ? "0 8px 20px rgba(2,6,23,0.08)" : "none",
});
const field = { display: "grid", gap: 6, marginTop: 12 };
const label = { fontSize: 12, fontWeight: 900, color: "#475569" };
const input = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(2,6,23,0.12)",
    outline: "none",
    fontSize: 14,
};
const error = {
    marginTop: 12,
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 12,
};
const primaryBtn = {
    marginTop: 14,
    width: "100%",
    background: "#0f172a",
    color: "white",
    border: "1px solid rgba(2,6,23,0.08)",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
};
const divider = { height: 1, background: "rgba(2,6,23,0.08)", margin: "16px 0" };
const demoBtn = (isAdmin) => ({
    border: "1px solid rgba(2,6,23,0.10)",
    borderRadius: 12,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 900,
    background: isAdmin ? "rgba(34,197,94,0.12)" : "rgba(96,165,250,0.14)",
    color: "#0f172a",
});
