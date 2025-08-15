"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  const [task, setTask] = useState({ title: "", description: "", status: "todo" });
  const [contexts, setContexts] = useState([]);
  const [suggest, setSuggest] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/categories/`).then(r => r.json()).then(setCats);
    fetch(`${API}/api/contexts/`).then(r => r.json()).then(setContexts);
    if (!isNew) {
      fetch(`${API}/api/tasks/${id}/`).then(r => r.json()).then(setTask);
    }
  }, [id, isNew]);

  const save = async () => {
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${API}/api/tasks/` : `${API}/api/tasks/${id}/`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    router.push("/");
  };

  const runAI = async () => {
    const payload = { task, contexts: contexts.slice(0, 5), current_load: 3 };
    const res = await fetch(`${API}/api/ai/suggest/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSuggest(data);
    setTask((t) => ({
      ...t,
      description: data.enhanced_description,
      priority_score: data.priority_score,
      deadline: data.deadline_suggestion,
      tags: data.suggested_tags,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Task Form */}
      <div className="grid gap-3 rounded-2xl p-4 bg-white shadow-sm">
        <input
          className="p-2 rounded text-black border border-gray-300 focus:ring-2 focus:ring-blue-400"
          placeholder="Title"
          value={task.title || ""}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <textarea
          className="p-2 rounded text-black border border-gray-300 focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          rows={5}
          value={task.description || ""}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />

        <div className="flex gap-3">
          <select
            className="p-2 rounded text-black border border-gray-300"
            value={task.status || "todo"}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            className="p-2 rounded text-black border border-gray-300"
            value={task.category || ""}
            onChange={(e) => setTask({ ...task, category: Number(e.target.value) || null })}
          >
            <option value="">No Category</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition"
            onClick={runAI}
          >
            AI Suggest
          </button>
          <button
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>

      {/* AI Suggestion Panel */}
      {suggest && (
        <div className="rounded-2xl p-4 bg-white text-black shadow space-y-2">
          <h3 className="font-semibold text-lg">AI Suggestions</h3>
          <div>Priority: <b>{suggest.priority_score}</b></div>
          <div>Deadline: <b>{suggest.deadline_suggestion}</b></div>
          <div>Category: <b>{suggest.suggested_category || "—"}</b></div>
          <div>Tags: {(suggest.suggested_tags || []).join(", ")}</div>
          <div className="text-sm text-gray-700">
            Context insights: top keywords {JSON.stringify(suggest.context_insights?.top_keywords)}
          </div>
        </div>
      )}
    </div>
  );
}
