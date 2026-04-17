"use client";

import { TrendingUp, Plus, Calendar, Target } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const categoryColors: Record<string, string> = {
  FINANCE: "#f59e0b", HEALTH: "#10b981", WORK: "#6366f1", PERSONAL: "#ec4899",
  EDUCATION: "#8b5cf6", SOCIAL: "#14b8a6", HOME: "#f97316", OTHER: "#64748b",
};

export default function GoalsPage() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await api.get('/goals');
      return res.data.data;
    }
  });

  const currentGoals = goals || [];

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <TrendingUp className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            Goals
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Track your long-term objectives</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentGoals.map((goal: any) => (
          <div key={goal.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ background: `${categoryColors[goal.category]}15`, color: categoryColors[goal.category] }}>
                  {goal.category}
                </span>
                <h3 className="text-lg font-semibold mt-2" style={{ color: "var(--text-primary)" }}>{goal.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Calendar className="w-3 h-3" />
                  Target: {new Date(goal.targetDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </div>
              </div>
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke={categoryColors[goal.category]} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${goal.progressPercent * 2.51} ${251 - goal.progressPercent * 2.51}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{goal.progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${goal.progressPercent}%`, background: categoryColors[goal.category] }} />
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              {goal.milestones?.map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: m.completed ? "var(--accent-success)" : "var(--border)",
                      background: m.completed ? "var(--accent-success)" : "transparent",
                    }}>
                    {m.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${m.completed ? "line-through" : ""}`}
                    style={{ color: m.completed ? "var(--text-muted)" : "var(--text-primary)" }}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
