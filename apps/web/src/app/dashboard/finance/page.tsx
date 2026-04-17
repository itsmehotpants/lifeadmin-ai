"use client";

import { CreditCard, Plus, AlertTriangle, Check, Clock, TrendingUp, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const typeColors: Record<string, string> = {
  BILL: "#f59e0b", SUBSCRIPTION: "#8b5cf6", LOAN_EMI: "#ef4444", INSURANCE: "#3b82f6", INVESTMENT: "#10b981", INCOME: "#22c55e", CUSTOM: "#64748b",
};
const typeIcons: Record<string, string> = {
  BILL: "📄", SUBSCRIPTION: "📺", LOAN_EMI: "🏦", INSURANCE: "🛡️", INVESTMENT: "📈", INCOME: "💰", CUSTOM: "📋",
};

export default function FinancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["finance"],
    queryFn: async () => {
      const res = await api.get('/finance');
      return res.data.data;
    }
  });

  const financeList = data || [];

  const totalMonthly = financeList.filter((f: any) => f.isRecurring).reduce((s: number, f: any) => s + f.amount, 0);
  const unpaid = financeList.filter((f: any) => !f.isPaid);
  const totalLateFeeRisk = unpaid.reduce((s: number, f: any) => s + (f.lateFeeAmount || 0), 0);
  const urgent = unpaid.filter((f: any) => f.daysUntilDue <= 3 && f.daysUntilDue >= 0);

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading finance metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <CreditCard className="w-6 h-6" style={{ color: "var(--accent-warning)" }} />
            Finance Tracker
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Track bills, subscriptions, and investments</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
              <IndianRupee className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{formatCurrency(totalMonthly)}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly obligations</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
              <Clock className="w-5 h-5" style={{ color: "var(--accent-warning)" }} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--accent-warning)" }}>{unpaid.length}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Unpaid items</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
              <AlertTriangle className="w-5 h-5" style={{ color: "var(--accent-danger)" }} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--accent-danger)" }}>{formatCurrency(totalLateFeeRisk)}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Total late fee risk</div>
        </div>
      </div>

      {/* Urgent Alert */}
      {urgent.length > 0 && (
        <div className="px-5 py-4 rounded-xl" style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--accent-warning)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--accent-warning)" }}>
              {urgent.length} payment{urgent.length > 1 ? "s" : ""} due within 3 days
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {urgent.map((u: any) => (
              <span key={u.id} className="text-xs px-3 py-1 rounded-lg" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-warning)" }}>
                {u.name} — {formatCurrency(u.amount)} {u.lateFeeAmount ? `(₹${u.lateFeeAmount} late fee)` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Finance Items */}
      <div className="space-y-2">
        {financeList.sort((a: any, b: any) => a.daysUntilDue - b.daysUntilDue).map((item: any) => (
          <div key={item.id} className="glass-card p-4 flex items-center gap-4" style={{ opacity: item.isPaid ? 0.5 : 1 }}>
            <span className="text-xl w-8 text-center">{typeIcons[item.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Due: {item.dueDay}th of month</span>
                {item.lateFeeAmount && !item.isPaid && (
                  <span className="text-xs" style={{ color: "var(--accent-danger)" }}>₹{item.lateFeeAmount} late fee</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{formatCurrency(item.amount)}</div>
              {item.isPaid ? (
                <span className="text-xs flex items-center gap-1 justify-end" style={{ color: "var(--accent-success)" }}>
                  <Check className="w-3 h-3" /> Paid
                </span>
              ) : (
                <span className="text-xs" style={{
                  color: item.daysUntilDue <= 3 ? "var(--accent-warning)" : "var(--text-muted)"
                }}>
                  {item.daysUntilDue > 0 ? `In ${item.daysUntilDue} days` : "Overdue"}
                </span>
              )}
            </div>
            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase flex-shrink-0"
              style={{ background: `${typeColors[item.type]}15`, color: typeColors[item.type] }}>
              {item.type.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
