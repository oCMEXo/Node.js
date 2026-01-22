import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Articles() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const load = async (text="") => {
    const rows = await api.listArticles(text);
    setItems(rows);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <input
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Search articles by title or content..."
          value={q}
          onChange={e => { setQ(e.target.value); load(e.target.value); }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
            <p className="text-gray-700 mb-4 line-clamp-3">{a.body}</p>
            <div className="text-sm text-gray-500">by {a.author_email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
