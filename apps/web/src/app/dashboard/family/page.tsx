"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { 
  Users, UserPlus, Shield, User as UserIcon, 
  Copy, Check, Trash2, Send, Sparkles 
} from "lucide-react";

export default function FamilyPage() {
  const { api, user } = useAuthStore();
  const [family, setFamily] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState("");

  const fetchFamily = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/family/members");
      if (data.success) {
        setFamily(data.data.id ? data.data : null);
      }
    } catch (err) {
      console.error("Failed to fetch family", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName) return;
    try {
      const { data } = await api.post("/family/create", { name: familyName });
      if (data.success) {
        setFamily(data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create family");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;
    try {
      const { data } = await api.post("/family/join", { inviteCode });
      if (data.success) {
        fetchFamily();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid invite code");
    }
  };

  const copyInviteCode = () => {
    if (!family?.inviteCode) return;
    navigator.clipboard.writeText(family.inviteCode);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse text-[var(--text-muted)]">Loading family...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Family <span className="gradient-text">Studio</span></h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your household collaboration and shared life events.</p>
        </div>
      </div>

      {!family ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Family */}
          <div className="glass-card p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
              <Shield className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Create Family Group</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Start a new group to share tasks, habits, and budgets with your family.</p>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Family Name (e.g. The Khannas)"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm transition-all focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
              />
              <button disabled={!familyName} className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                Create Group
              </button>
            </form>
          </div>

          {/* Join Family */}
          <div className="glass-card p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
              <UserPlus className="w-6 h-6" style={{ color: "var(--accent-success)" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Join Existing Family</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Enter an invitation code from a family member to join their group.</p>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                placeholder="Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm transition-all focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
              />
              <button disabled={!inviteCode} className="w-full btn-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                Join Now
              </button>
            </form>
          </div>

          {error && <div className="md:col-span-2 text-center text-sm text-[var(--accent-danger)] bg-[var(--accent-danger)]/10 p-4 rounded-xl border border-[var(--accent-danger)]/20">{error}</div>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--accent-primary)]" />
                  {family.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {family.members.length} Members
                </span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {family.members.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-elevated)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                        {m.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-bold flex items-center gap-2">
                          {m.user?.name}
                          {m.role === 'owner' && <Shield className="w-3 h-3 text-amber-400" />}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{m.user?.email}</div>
                      </div>
                    </div>
                    {m.userId !== user?.id && family.ownerId === user?.id && (
                      <button className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-danger)] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {m.userId === user?.id && (
                       <span className="text-[10px] uppercase tracking-wider font-bold bg-white/5 px-2 py-1 rounded-md text-[var(--text-muted)]">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Activity Skeleton */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Shared Life Stream
              </h3>
              <div className="space-y-4 opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <div className="flex-1 h-4 bg-[var(--bg-elevated)] rounded shadow-inner" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <div className="flex-1 h-4 bg-[var(--bg-elevated)] rounded shadow-inner w-3/4" />
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-[var(--text-muted)] italic">
                Family tasks and habit streaks will appear here automatically.
              </div>
            </div>
          </div>

          {/* Invitation Panel */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-6 bg-indigo-600/5 border-indigo-500/20">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Invite Family Members</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Share this code with your household members to link your accounts.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--text-muted)" }}>Invitation Code</label>
                <div className="relative">
                  <div 
                    className="w-full bg-[var(--bg-secondary)] border border-indigo-500/30 rounded-xl px-4 py-4 text-center font-mono text-2xl font-bold tracking-[0.2em] text-indigo-400 shadow-inner"
                  >
                    {family.inviteCode}
                  </div>
                  <button 
                    onClick={copyInviteCode}
                    className="absolute top-1/2 -right-3 -translate-y-1/2 p-3 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"
                  >
                    {isCopying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] text-amber-200/70 leading-relaxed font-medium">
                  <span className="font-bold">PRO Tip:</span> Family sharing allows members to see your shared tasks and contribute to joint household habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
