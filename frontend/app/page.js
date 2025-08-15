"use client";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const fetcher = (url) => fetch(url).then((res) => res.json());

function PriorityBadge({ score }) {
  let level, color;
  if (score >= 70) {
    level = "High";
    color = "bg-red-500";
  } else if (score >= 40) {
    level = "Medium";
    color = "bg-yellow-500";
  } else {
    level = "Low";
    color = "bg-green-500";
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${color}`}
    >
      {level} ({score})
    </span>
  );
}

function StatusBadge({ status }) {
  const colors = {
    todo: "bg-blue-500",
    in_progress: "bg-orange-500",
    done: "bg-green-600",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs text-white ${
        colors[status] || "bg-gray-400"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function Dashboard() {
  const [filters, set] = useState({ status: "", category: "" });
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const qs = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v)
  ).toString();

  const { data, mutate } = useSWR(
    `${API}/api/tasks/${qs ? "?" + qs : ""}`,
    fetcher
  );

  const cats = useSWR(`${API}/api/categories/`, fetcher).data || [];

  const addTask = async () => {
    if (!newTask.title) return;
    await fetch(`${API}/api/tasks/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    setShowModal(false);
    setNewTask({ title: "", description: "" });
    mutate();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Focus<span className="text-blue-600">Flow</span> Dashboard
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition duration-200"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-8">
        <select
          className="p-2 rounded-lg bg-white shadow-sm text-gray-700 border border-gray-200 focus:ring-2 focus:ring-blue-400"
          value={filters.status}
          onChange={(e) => set({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="p-2 rounded-lg bg-white shadow-sm text-gray-700 border border-gray-200 focus:ring-2 focus:ring-blue-400"
          value={filters.category}
          onChange={(e) => set({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Grid */}
      {(!data || data.length === 0) && (
        <div className="flex flex-col items-center justify-center text-gray-500 py-20">
          <img
            src="https://illustrations.popsy.co/gray/organized.svg"
            alt="No tasks"
            className="w-40 mb-4 opacity-80"
          />
          <p className="text-lg">No tasks found. Try adding one!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((t) => (
          <div
            key={t.id}
            className="rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">{t.title}</h3>
              <PriorityBadge score={Math.round(t.priority_score)} />
            </div>

            <p className="text-sm text-gray-600 mt-3 line-clamp-3">
              {t.description || "No description provided."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                {t.category_name || "Uncategorized"}
              </span>
              <StatusBadge status={t.status} />
              {t.deadline && (
                <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                  Due {t.deadline}
                </span>
              )}
            </div>

            <div className="mt-4">
              <Link
                href={`/task/${t.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding tasks */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
