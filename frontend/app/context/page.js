"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function ContextPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ content: "", source: "notes" });

  const load = () =>
    fetch(`${API}/api/contexts/`)
      .then((r) => r.json())
      .then(setItems);

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!form.content) return;
    await fetch(`${API}/api/contexts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ content: "", source: "notes" });
    load();
  };

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="rounded-2xl p-4 bg-white text-black shadow-sm">
        <h3 className="font-semibold mb-3">Add Daily Context</h3>
        <textarea
          className="p-2 rounded w-full text-black border border-gray-300 focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Paste message/email/note..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="flex gap-3 mt-2">
          <select
            className="p-2 rounded text-black border border-gray-300 focus:ring-2 focus:ring-blue-400"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="notes">Notes</option>
          </select>
          <button
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition"
            onClick={add}
          >
            Add
          </button>
        </div>
      </div>

      {/* Context Items */}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl p-4 bg-white text-black shadow hover:shadow-lg transition"
          >
            <div className="text-sm uppercase font-semibold text-gray-500">
              {c.source}
            </div>
            <div className="mt-2">{c.content}</div>
            <div className="mt-1 text-xs text-gray-600">
              {new Date(c.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
