"use client";

import { BarChart3, TrendingUp, Zap, Brain } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      // Assuming a generic /analytics endpoint handling this
      const res = await api.get('/analytics/dashboard');
      return res.data.data;
    }
  });

  const weeklyData = analytics?.weeklyData || [
    { day: "Mon", completed: 0, total: 0 },
    { day: "Tue", completed: 0, total: 0 },
    { day: "Wed", completed: 0, total: 0 },
    { day: "Thu", completed: 0, total: 0 },
    { day: "Fri", completed: 0, total: 0 },
    { day: "Sat", completed: 0, total: 0 },
    { day: "Sun", completed: 0, total: 0 },
  ];

  const categoryBreakdown = analytics?.categoryBreakdown || [];

  const totalCat = categoryBreakdown.reduce((s: number, c: any) => s + c.count, 0);

  const maxCompleted = Math.max(...weeklyData.map((d: any) => d.total), 1);

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <BarChart3 className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Your productivity insights and trends</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="text-3xl font-bold gradient-text">{analytics?.completionRate || 0}%</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Completion Rate</div>
          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--accent-success)" }}>
            <TrendingUp className="w-3 h-3" /> +5% from last week
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{analytics?.tasksCompleted || 0}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Tasks Completed</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-bold" style={{ color: "var(--accent-warning)" }}>10am</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Peak Productive Hour</div>
          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--accent-info)" }}>
            <Zap className="w-3 h-3" /> Most tasks completed
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-3xl font-bold" style={{ color: "var(--accent-success)" }}>{analytics?.peakDay || "Mon"}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Most Productive Day</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            Weekly Task Completion
          </h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((d: any) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1" style={{ height: "120px" }}>
                  <div className="w-full rounded-t-lg relative flex-1 flex items-end">
                    <div className="w-full rounded-lg transition-all duration-500"
                      style={{
                        height: `${(d.total / maxCompleted) * 100}%`,
                        background: "var(--bg-elevated)",
                        position: "absolute",
                        bottom: 0,
                      }} />
                    <div className="w-full rounded-lg transition-all duration-500 relative z-10"
                      style={{
                        height: `${(d.completed / maxCompleted) * 100}%`,
                        background: d.completed === d.total ? "var(--gradient-success)" : "var(--gradient-primary)",
                        position: "absolute",
                        bottom: 0,
                      }} />
                  </div>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <span className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <div className="w-3 h-3 rounded" style={{ background: "var(--accent-primary)" }} /> Completed
            </span>
            <span className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <div className="w-3 h-3 rounded" style={{ background: "var(--bg-elevated)" }} /> Total
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            Category Breakdown
          </h3>
          {/* Donut Chart (CSS) */}
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {categoryBreakdown.reduce((acc: any, cat: any, i: number) => {
                  const percentage = (cat.count / totalCat) * 100;
                  const offset = acc.offset;
                  acc.elements.push(
                    <circle key={cat.category} cx="50" cy="50" r="40" fill="none"
                      stroke={cat.color} strokeWidth="12"
                      strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                      strokeDashoffset={-offset * 2.51}
                      className="transition-all duration-500" />
                  );
                  acc.offset += percentage;
                  return acc;
                }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{totalCat}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>tasks</div>
                </div>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {categoryBreakdown.map((cat: any) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>{cat.category}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cat.count}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{Math.round((cat.count / totalCat) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Discipline Score Trend */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <Brain className="w-4 h-4" style={{ color: "var(--accent-primary)" }} /> Discipline Score Trend (Last 4 Weeks)
        </h3>
        <div className="flex items-end gap-2 h-32">
          {(analytics?.disciplineScores || [0, 0, 0, 0]).map((score: number, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{score}</div>
              <div className="w-full rounded-lg transition-all duration-500"
                style={{ height: `${score}%`, background: `linear-gradient(to top, #6366f1, #10b981)` }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
