import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

export default function Articles({ user }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    setErr("");
    try {
      const rows = await api.listArticles();
      setItems(rows);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.createArticle(title, body);
      setTitle(""); setBody("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const canEdit = (a) => {
    if (!user) return false;
    return user.role === "admin" || a.author_id === user.id;
  };

  const save = async (a) => {
    setErr("");
    try {
      await api.updateArticle(a.id, { title: a._editTitle ?? a.title, body: a._editBody ?? a.body });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const del = async (id) => {
    setErr("");
    try {
      await api.deleteArticle(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Articles</h2>

      {user ? (
        <form onSubmit={create} style={{ display: "grid", gap: 8, maxWidth: 680, marginBottom: 16 }}>
          <h3>Create</h3>
          <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="body" value={body} onChange={e => setBody(e.target.value)} rows={4} />
          <button type="submit">Publish</button>
        </form>
      ) : (
        <div style={{ marginBottom: 16, opacity: 0.8 }}>Login to create and edit your articles.</div>
      )}

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map(a => (
          <ArticleCard
            key={a.id}
            a={a}
            editable={canEdit(a)}
            onChange={(patch) => {
              setItems(prev => prev.map(x => x.id === a.id ? { ...x, ...patch } : x));
            }}
            onSave={() => save(a)}
            onDelete={() => del(a.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ a, editable, onChange, onSave, onDelete }) {
  const editTitle = a._editTitle ?? a.title;
  const editBody = a._editBody ?? a.body;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>{a.title}</div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>by {a.author_email}</div>
      </div>

      {editable ? (
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <input value={editTitle} onChange={e => onChange({ _editTitle: e.target.value })} />
          <textarea rows={4} value={editBody} onChange={e => onChange({ _editBody: e.target.value })} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onSave}>Save</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{a.body}</p>
      )}
    </div>
  );
}
