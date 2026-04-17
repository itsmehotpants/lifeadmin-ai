"use client";

import { useState } from "react";
import { CheckSquare, Plus, Filter, Search, AlertTriangle, Clock, ChevronDown, Calendar, Tag } from "lucide-react";

const PRIORITIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
const CATEGORIES = ["ALL", "FINANCE", "HEALTH", "WORK", "PERSONAL", "EDUCATION", "SOCIAL", "HOME", "OTHER"] as const;
const STATUS_FILTERS = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"] as const;

const priorityColors: Record<string, string> = {
  LOW: "#64748b", MEDIUM: "#3b82f6", HIGH: "#f59e0b", CRITICAL: "#ef4444",
};
const categoryColors: Record<string, string> = {
  FINANCE: "#f59e0b", HEALTH: "#10b981", WORK: "#6366f1", PERSONAL: "#ec4899",
  EDUCATION: "#8b5cf6", SOCIAL: "#14b8a6", HOME: "#f97316", OTHER: "#64748b",
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task } from "../../../../../packages/shared/src/types";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      const res = await api.get(`/tasks?${params.toString()}`);
      return res.data.data as Task[];
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => await api.patch(`/tasks/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const tasks = data || [];

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
    return true;
  });

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== "COMPLETED") {
      completeMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <CheckSquare className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            Tasks
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {filteredTasks.length} tasks{statusFilter !== "ALL" ? ` (${statusFilter.toLowerCase()})` : ""}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search tasks..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }} />
          </div>
          <FilterDropdown label="Priority" options={PRIORITIES} value={priorityFilter} onChange={setPriorityFilter} />
          <FilterDropdown label="Category" options={CATEGORIES} value={categoryFilter} onChange={setCategoryFilter} />
          <FilterDropdown label="Status" options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading tasks...</div>
        ) : filteredTasks.map((task) => (
          <div key={task.id} className="glass-card p-4 flex items-center gap-4 group cursor-pointer"
            style={{ opacity: task.status === "COMPLETED" ? 0.6 : 1 }}>
            <button onClick={() => toggleComplete(task.id)}
              className="w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110"
              style={{
                borderColor: task.status === "COMPLETED" ? "var(--accent-success)" : priorityColors[task.priority],
                background: task.status === "COMPLETED" ? "var(--accent-success)" : "transparent",
              }}>
              {task.status === "COMPLETED" && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${task.status === "COMPLETED" ? "line-through" : ""}`}
                style={{ color: "var(--text-primary)" }}>{task.title}</div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {task.dueDate && (
                  <span className="text-xs flex items-center gap-1"
                    style={{ color: task.status === "OVERDUE" ? "var(--accent-danger)" : "var(--text-muted)" }}>
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                )}
                {task.consequenceText && (
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--accent-warning)" }}>
                    <AlertTriangle className="w-3 h-3" />
                    {task.consequenceText}
                  </span>
                )}
                {task.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase flex-shrink-0"
              style={{ background: `${categoryColors[task.category]}15`, color: categoryColors[task.category] }}>
              {task.category}
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase flex-shrink-0"
              style={{ background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority] }}>
              {task.priority}
            </span>
          </div>
        ))}

        {(!isLoading && filteredTasks.length === 0) && (
          <div className="glass-card p-12 text-center">
            <CheckSquare className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No tasks found</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your filters or add a new task</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm cursor-pointer"
        style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "var(--bg-card)" }}>
            {label}: {o === "ALL" ? "All" : o.charAt(0) + o.slice(1).toLowerCase().replace("_", " ")}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--text-muted)" }} />
    </div>
  );
}
