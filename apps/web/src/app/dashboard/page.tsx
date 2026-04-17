"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { getGreeting, formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  CheckSquare, Clock, AlertTriangle, CalendarDays,
  TrendingUp, CreditCard, Bell, Sparkles, ChevronRight,
  Plus, ArrowUpRight, Flame, Brain, Loader2, Send
} from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Mock data for demonstration
  const stats = {
    todayTasks: 4,
    completedToday: 1,
    overdueTasks: 2,
    upcomingThisWeek: 6,
    disciplineScore: 76,
  };

  const todayTasks = [
    { id: "1", title: "Pay Rent", priority: "CRITICAL", category: "FINANCE", dueDate: new Date().toISOString(), consequenceText: "₹500 late fee after 5th" },
    { id: "2", title: "Gym — Push Day", priority: "HIGH", category: "HEALTH", dueDate: new Date().toISOString(), consequenceText: null },
    { id: "3", title: "Submit Project Proposal", priority: "HIGH", category: "WORK", dueDate: new Date().toISOString(), consequenceText: "Deadline miss affects review" },
    { id: "4", title: "Buy groceries", priority: "MEDIUM", category: "PERSONAL", dueDate: new Date().toISOString(), consequenceText: null },
  ];

  const habitStreaks = [
    { name: "Gym", icon: "💪", current: 8, target: 10, color: "#6366f1" },
    { name: "Study", icon: "📚", current: 12, target: 15, color: "#8b5cf6" },
    { name: "Meditate", icon: "🧘", current: 5, target: 10, color: "#10b981" },
    { name: "Read", icon: "📖", current: 3, target: 7, color: "#f59e0b" },
  ];

  const financeAlerts = [
    { name: "Electricity Bill", dueIn: 2, amount: 1450, lateFee: 150 },
    { name: "Netflix Subscription", dueIn: 5, amount: 649, lateFee: null },
    { name: "SIP — Axis Bluechip", dueIn: 7, amount: 5000, lateFee: null },
  ];

  const weeklyInsights = [
    { type: "praise" as const, title: "Strong work streak", body: "You completed 85% of work tasks this week. Your consistency is paying off.", action: "Keep the momentum going!" },
    { type: "warning" as const, title: "Finance needs attention", body: "2 bills are due this week. Missing them could cost ₹350 in late fees.", action: "Pay bills today" },
    { type: "tip" as const, title: "Best day: Wednesday", body: "You're most productive mid-week. Schedule important tasks on Wednesdays.", action: "Plan next Wednesday" },
  ];

  const priorityColors: Record<string, string> = {
    LOW: "#64748b", MEDIUM: "#3b82f6", HIGH: "#f59e0b", CRITICAL: "#ef4444",
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 stagger-children">
      {/* ─── GREETING ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s your life at a glance
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <AITaskInputBar />

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CheckSquare className="w-5 h-5" />} label="Today's Tasks" value={`${stats.completedToday}/${stats.todayTasks}`} color="#6366f1" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Overdue" value={String(stats.overdueTasks)} color="#ef4444" alert />
        <StatCard icon={<CalendarDays className="w-5 h-5" />} label="This Week" value={String(stats.upcomingThisWeek)} color="#8b5cf6" />
        <DisciplineScoreCard score={stats.disciplineScore} />
      </div>

      {/* ─── MAIN GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Clock className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
              Today&apos;s Tasks
            </h2>
            <a href="/dashboard/tasks" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--accent-primary)" }}>
              View all <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div className="w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all cursor-pointer hover:scale-110"
                  style={{ borderColor: priorityColors[task.priority] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{task.title}</div>
                  {task.consequenceText && (
                    <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--accent-warning)" }}>
                      <AlertTriangle className="w-3 h-3" />
                      {task.consequenceText}
                    </div>
                  )}
                </div>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                  style={{ background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority] }}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Finance Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <CreditCard className="w-5 h-5" style={{ color: "var(--accent-warning)" }} />
              Finance Alerts
            </h2>
          </div>
          <div className="space-y-3">
            {financeAlerts.map((alert) => (
              <div key={alert.name} className="px-4 py-3 rounded-xl"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{alert.name}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{formatCurrency(alert.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: alert.dueIn <= 3 ? "var(--accent-warning)" : "var(--text-muted)" }}>
                    Due in {alert.dueIn} days
                  </span>
                  {alert.lateFee && (
                    <span className="text-xs" style={{ color: "var(--accent-danger)" }}>
                      ₹{alert.lateFee} late fee
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Streaks */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Flame className="w-5 h-5" style={{ color: "var(--accent-success)" }} />
              Habit Streaks
            </h2>
          </div>
          <div className="space-y-4">
            {habitStreaks.map((habit) => (
              <div key={habit.name} className="flex items-center gap-4">
                <span className="text-xl w-8 text-center">{habit.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{habit.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{habit.current} days</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(habit.current / habit.target) * 100}%`, background: habit.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
              AI Insights
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--accent-primary)" }}>
              PRO
            </span>
          </div>
          <div className="space-y-3">
            {weeklyInsights.map((insight) => {
              const typeConfig = {
                praise: { color: "var(--accent-success)", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.15)", icon: "✨" },
                warning: { color: "var(--accent-warning)", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.15)", icon: "⚠️" },
                tip: { color: "var(--accent-info)", bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.15)", icon: "💡" },
              }[insight.type];

              return (
                <div key={insight.title} className="px-4 py-3 rounded-xl"
                  style={{ background: typeConfig.bg, border: `1px solid ${typeConfig.border}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{typeConfig.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: typeConfig.color }}>{insight.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{insight.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ icon, label, value, color, alert }: { icon: React.ReactNode; label: string; value: string; color: string; alert?: boolean }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl" style={{ background: `${color}15`, color }}>{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: alert ? "var(--accent-danger)" : "var(--text-primary)" }}>{value}</div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}

function DisciplineScoreCard({ score }: { score: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4">
        <svg width="70" height="70" className="transform -rotate-90">
          <circle cx="35" cy="35" r={radius} fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
          <circle cx="35" cy="35" r={radius} fill="none" stroke="url(#scoreGradient)" strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }} />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{score}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Discipline Score</div>
        </div>
      </div>
    </div>
  );
}

function AITaskInputBar() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      // 1. Ask Gemini to extract attributes
      const { data } = await api.post("/ai/parse-task", { input });
      const parsedTask = data.data;

      // 2. Submit to actual Task schema
      await api.post("/tasks", parsedTask);
      
      setSuccessMsg(`Created: ${parsedTask.title}`);
      setInput("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMsg("Error: Failed to parse or create.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleParse} className="relative w-full shadow-lg rounded-2xl flex items-center p-1.5"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="pl-4 pr-2 flex items-center justify-center">
         <Sparkles className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to create a task via AI... (e.g., Remind me to pay rent next Tuesday)"
        className="flex-1 px-2 py-3 bg-transparent text-sm w-full outline-none"
        style={{ color: "var(--text-primary)" }}
        disabled={loading}
      />
      
      {successMsg && (
        <span className="text-xs mr-3 font-semibold shine-text" style={{ color: "var(--accent-success)" }}>
          {successMsg}
        </span>
      )}
      
      <button 
        type="submit" 
        disabled={loading || !input.trim()}
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-50"
        style={{ background: "var(--gradient-primary)", color: "white" }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </form>
  )
}
