"use client";

import { Settings, User, Bell, CreditCard, Shield, Globe, Moon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Settings className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--text-primary)" }}>
          <User className="w-4 h-4" style={{ color: "var(--accent-primary)" }} /> Profile
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Name</label>
              <input type="text" defaultValue="Naman" className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input type="email" defaultValue="naman@example.com" disabled className="w-full px-4 py-2.5 rounded-xl text-sm opacity-60"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Timezone</label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}>
                <option>Asia/Kolkata (IST)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Currency</label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}>
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--text-primary)" }}>
          <Bell className="w-4 h-4" style={{ color: "var(--accent-primary)" }} /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: "Push Notifications", desc: "Get notified on your browser", enabled: true },
            { label: "Email Reminders", desc: "Receive reminders via email", enabled: true },
            { label: "WhatsApp Alerts", desc: "Get alerts on WhatsApp", enabled: false },
            { label: "Weekly Digest", desc: "Get a weekly summary email", enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
              </div>
              <button className="w-11 h-6 rounded-full transition-all relative"
                style={{ background: item.enabled ? "var(--accent-primary)" : "var(--bg-elevated)" }}>
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
                  style={{ left: item.enabled ? "calc(100% - 20px)" : "4px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--text-primary)" }}>
          <CreditCard className="w-4 h-4" style={{ color: "var(--accent-warning)" }} /> Subscription
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Free Plan</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>20 tasks, basic reminders</div>
          </div>
          <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}>
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6" style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}>
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--accent-danger)" }}>
          <Shield className="w-4 h-4" /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Delete Account</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Permanently delete your account and all data</div>
          </div>
          <button className="px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--accent-danger)" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
