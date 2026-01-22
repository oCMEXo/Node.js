import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const rows = await api.adminListUsers();
      setUsers(rows);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    setErr("");
    try {
      const updated = await api.adminUpdateRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>User Management (admin only)</h2>
      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}
      <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f6f6f6" }}>
              <th style={{ textAlign: "left", padding: 10 }}>ID</th>
              <th style={{ textAlign: "left", padding: 10 }}>Email</th>
              <th style={{ textAlign: "left", padding: 10 }}>Role</th>
              <th style={{ textAlign: "left", padding: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{u.id}</td>
                <td style={{ padding: 10 }}>{u.email}</td>
                <td style={{ padding: 10 }}>
                  <select
                    value={u.role}
                    onChange={e => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: e.target.value } : x))}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => updateRole(u.id, u.role)} disabled={u.id === user?.id}>
                    Save
                  </button>
                  {u.id === user?.id && <span style={{ marginLeft: 8, opacity: 0.7 }}>(you)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ opacity: 0.7, marginTop: 10 }}>
        Note: button is disabled for changing your own role (front-end only). Backend allows it by default; you can enable the guard there too.
      </p>
    </div>
  );
}
