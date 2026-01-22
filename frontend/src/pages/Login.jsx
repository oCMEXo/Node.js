import React, { useState } from "react";
import { api } from "../api.js";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { user, token } = await api.login(email, password);
      onAuth(user, token);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </form>
    </div>
  );
}
