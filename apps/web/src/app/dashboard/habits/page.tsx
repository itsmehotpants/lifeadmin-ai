"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Target, Flame, Plus, TrendingUp } from "lucide-react";
import api from "@/lib/api";

// Generate last 30 days contribution data
function generateContributionData() {
  const data: { date: string; level: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      level: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
    });
  }
  return data;
}

export default function HabitsPage() {
  const queryClient = useQueryClient();

  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await api.get('/habits');
      return res.data.data;
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => await api.post(`/habits/${id}/log`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    }
  });

  const contributionData = generateContributionData();

  const toggleComplete = (id: string) => {
    toggleMutation.mutate(id);
  };

  const currentHabits = habits || [];
  const completedCount = currentHabits.filter((h: any) => h.completedToday).length;
  const levelColors = ["var(--bg-elevated)", "#6366f133", "#6366f166", "#6366f199", "#6366f1"];

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Target className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            Habits
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {completedCount}/{currentHabits.length} completed today
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      {/* Contribution Calendar */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <TrendingUp className="w-4 h-4" /> Habit Compliance — Last 30 Days
        </h3>
        <div className="flex gap-1 flex-wrap">
          {contributionData.map((d) => (
            <div key={d.date} className="w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-pointer"
              title={`${d.date}: Level ${d.level}`}
              style={{ background: levelColors[d.level] }} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Less</span>
          {levelColors.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>More</span>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentHabits.map((habit: any) => (
          <div key={habit.id} className="glass-card p-5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{habit.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{habit.frequency}</div>
                </div>
              </div>
              <button onClick={() => toggleComplete(habit.id)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: habit.completedToday ? habit.color : "var(--bg-elevated)",
                  border: `2px solid ${habit.completedToday ? habit.color : "var(--border)"}`,
                  color: habit.completedToday ? "white" : "var(--text-muted)",
                }}>
                {habit.completedToday ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                <div className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: habit.color }}>
                  <Flame className="w-4 h-4" />
                  {habit.currentStreak}
                </div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Current</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{habit.longestStreak}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Best</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{habit.totalCompletions}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Total</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
