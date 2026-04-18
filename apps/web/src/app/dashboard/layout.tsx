"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import {
  Brain, LayoutDashboard, CheckSquare, TrendingUp,
  CreditCard, Target, BarChart3, Settings, LogOut,
  Bell, Search, Sparkles, Menu, X, ChevronDown, Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/habits", label: "Habits", icon: Target },
  { href: "/dashboard/finance", label: "Finance", icon: CreditCard },
  { href: "/dashboard/family", label: "Family", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/goals", label: "Goals", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, fetchUser, logout, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Cmd+K command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse" style={{ background: "var(--gradient-primary)" }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span style={{ color: "var(--text-secondary)" }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`} style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: "1px solid var(--border)" }}>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold">
                LifeAdmin <span className="gradient-text">AI</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "var(--text-muted)" }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                    color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                    border: isActive ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid transparent",
                  }}>
                  <Icon className="w-4.5 h-4.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-3">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--gradient-primary)" }}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{user?.name || "User"}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.plan || "Free"} Plan</div>
              </div>
              <button onClick={() => logout()} title="Logout" style={{ color: "var(--text-muted)" }}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-8 glass"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: "var(--text-secondary)" }}>
              <Menu className="w-5 h-5" />
            </button>

            {/* Search / Command palette trigger */}
            <button onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all hover:border-[var(--border-hover)]"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <Search className="w-4 h-4" />
              <span>Add task or search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl transition-all hover:bg-[var(--bg-elevated)]" style={{ color: "var(--text-secondary)" }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--accent-danger)" }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ─── COMMAND PALETTE (Cmd+K) ─── */}
      {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
        <div className="glass-card overflow-hidden" style={{ boxShadow: "var(--shadow-glow-lg)" }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <Sparkles className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
            <input
              autoFocus
              type="text"
              placeholder="Type a task, e.g. 'pay rent 5th every month ₹12000'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
              style={{ color: "var(--text-primary)" }}
            />
            <kbd className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
              ESC
            </kbd>
          </div>

          {input.length > 2 && (
            <div className="p-4">
              <div className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>AI will parse this into a structured task</div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                <Sparkles className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Create task: &quot;{input}&quot;
                </span>
              </div>
            </div>
          )}

          {!input && (
            <div className="p-4 space-y-2">
              <div className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Quick actions</div>
              {[
                { label: "Add new task", icon: CheckSquare },
                { label: "View today's tasks", icon: LayoutDashboard },
                { label: "Check overdue", icon: Bell },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
