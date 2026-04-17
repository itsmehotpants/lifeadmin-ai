"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Zap, Shield, Clock, TrendingUp, CreditCard,
  ChevronRight, Check, Star, ArrowRight, Sparkles,
  CalendarCheck, Target, BarChart3, Bell, Menu, X,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                LifeAdmin <span className="gradient-text">AI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>Features</a>
              <a href="#how-it-works" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>How it Works</a>
              <a href="#pricing" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>Pricing</a>
              <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>
                Log in
              </Link>
              <Link href="/signup"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 glow-effect"
                style={{ background: "var(--gradient-primary)" }}>
                Start Free
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" style={{ color: "var(--text-secondary)" }}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 glass" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm py-2" style={{ color: "var(--text-secondary)" }}>Features</a>
              <a href="#pricing" className="text-sm py-2" style={{ color: "var(--text-secondary)" }}>Pricing</a>
              <Link href="/login" className="text-sm py-2" style={{ color: "var(--text-secondary)" }}>Log in</Link>
              <Link href="/signup" className="px-5 py-2 rounded-lg text-sm font-semibold text-white text-center" style={{ background: "var(--gradient-primary)" }}>
                Start Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
          style={{ background: "var(--gradient-glow)" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", color: "var(--accent-primary)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Powered by AI — Now in Beta
            </div>
          </motion.div>

          <motion.h1 {...fadeInUp} transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            The operating system{" "}
            <br className="hidden sm:block" />
            for your <span className="gradient-text">personal life</span>
          </motion.h1>

          <motion.p {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}>
            LifeAdmin AI predicts what you&apos;ll forget before you forget it.
            Tasks, bills, habits, and goals — unified with intelligence.
          </motion.p>

          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:scale-105 glow-effect animate-pulse-glow"
              style={{ background: "var(--gradient-primary)" }}>
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium transition-all hover:scale-102"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 relative">
            <div className="glass-card p-1 mx-auto max-w-4xl" style={{ boxShadow: "var(--shadow-glow-lg)" }}>
              <div className="rounded-[11px] overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                {/* Mock Dashboard */}
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
                  </div>
                  <div className="flex-1 h-7 rounded-md mx-auto max-w-sm" style={{ background: "var(--bg-card)" }} />
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DashboardPreviewCard title="Today's Tasks" value="4 tasks" icon={<CalendarCheck className="w-5 h-5" />} color="#6366f1" />
                  <DashboardPreviewCard title="Discipline Score" value="76/100" icon={<Target className="w-5 h-5" />} color="#10b981" />
                  <DashboardPreviewCard title="Bills Due" value="₹12,000" icon={<CreditCard className="w-5 h-5" />} color="#f59e0b" />
                </div>
                <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <div className="text-xs font-medium mb-3" style={{ color: "var(--text-secondary)" }}>Habit Streaks</div>
                    <div className="space-y-2">
                      {[
                        { icon: "💪", name: "Gym", streak: 8 },
                        { icon: "📚", name: "Study", streak: 12 },
                        { icon: "🧘", name: "Meditate", streak: 5 },
                      ].map((h) => (
                        <div key={h.name} className="flex items-center gap-3">
                          <span className="text-sm">{h.icon}</span>
                          <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{h.name}</span>
                          <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                            <div className="h-full rounded-full" style={{ width: `${h.streak * 10}%`, background: "var(--gradient-primary)" }} />
                          </div>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{h.streak}d</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <div className="text-xs font-medium mb-3" style={{ color: "var(--text-secondary)" }}>Finance Alert</div>
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.15)" }}>
                      <Bell className="w-4 h-4 mt-0.5" style={{ color: "var(--accent-warning)" }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Electricity bill due in 2 days</div>
                        <div className="text-xs mt-1" style={{ color: "var(--accent-warning)" }}>₹150 late fee if missed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={staggerContainer} className="text-center mb-16">
            <motion.p {...fadeInUp} className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-primary)" }}>
              Features
            </motion.p>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don&apos;t</span>
            </motion.h2>
            <motion.p {...fadeInUp} className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              One app to replace the 5 you&apos;re juggling. Unified, intelligent, and personal.
            </motion.p>
          </motion.div>

          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain className="w-6 h-6" />, title: "AI Task Parsing", desc: "Type 'pay rent 5th every month ₹12000' and our AI structures it instantly.", color: "#6366f1" },
              { icon: <Bell className="w-6 h-6" />, title: "Smart Reminders", desc: "Context-aware notifications that know urgency, consequences, and your behavior.", color: "#8b5cf6" },
              { icon: <Shield className="w-6 h-6" />, title: "Consequence Engine", desc: "Know exactly what you'll lose — ₹200 late fee, broken streak, missed deadline.", color: "#ef4444" },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Behavior Analytics", desc: "Your discipline score, peak hours, delay patterns — all learned over time.", color: "#10b981" },
              { icon: <CreditCard className="w-6 h-6" />, title: "Finance Tracking", desc: "Bills, EMIs, subscriptions — never miss a payment or late fee again.", color: "#f59e0b" },
              { icon: <Target className="w-6 h-6" />, title: "Goal Planning", desc: "AI-generated weekly plans to achieve your goals step by step.", color: "#ec4899" },
            ].map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}
                className="glass-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-primary)" }}>How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From chaos to <span className="gradient-text">clarity in 3 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Dump everything", desc: "Type, speak, or paste. 'Pay rent 5th', 'gym daily', 'SIP on 15th'. Our AI gets it." },
              { step: "02", title: "AI organizes & alerts", desc: "Tasks are categorized, prioritized, and linked. Smart reminders adapt to your behavior." },
              { step: "03", title: "Watch your life improve", desc: "Your discipline score rises, streaks grow, and you stop forgetting things that matter." },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="text-6xl font-black mb-4 gradient-text opacity-30">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-primary)" }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              title="Free"
              price="₹0"
              period="forever"
              features={["Up to 20 tasks", "Basic reminders", "3 habits", "Finance tracking"]}
              cta="Start Free"
              href="/signup"
              highlighted={false}
            />
            <PricingCard
              title="Pro"
              price="₹199"
              period="/month"
              features={["Unlimited tasks", "AI task parsing", "Smart reminders", "Behavior analytics", "Unlimited habits", "Priority support"]}
              cta="Start Pro Trial"
              href="/signup?plan=pro"
              highlighted={true}
              badge="Most Popular"
            />
            <PricingCard
              title="Premium"
              price="₹499"
              period="/month"
              features={["Everything in Pro", "Consequence engine", "Goal planning (AI)", "Family sharing (5)", "WhatsApp integration", "Bank statement import"]}
              cta="Go Premium"
              href="/signup?plan=premium"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden" style={{ boxShadow: "var(--shadow-glow-lg)" }}>
            <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to take control?
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                Join thousands managing their life with AI. Free to start, no credit card needed.
              </p>
              <Link href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:scale-105"
                style={{ background: "var(--gradient-primary)" }}>
                Get Started Now
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">LifeAdmin AI</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                The OS for your personal life.
              </p>
            </div>
            <FooterColumn title="Product" links={["Features", "Pricing", "Changelog", "Roadmap"]} />
            <FooterColumn title="Company" links={["About", "Blog", "Careers", "Contact"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms", "Security"]} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} LifeAdmin AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── SUB COMPONENTS ─── */

function DashboardPreviewCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg" style={{ background: `${color}15`, color }}>{icon}</div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{title}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function PricingCard({
  title, price, period, features, cta, href, highlighted, badge,
}: {
  title: string; price: string; period: string; features: string[];
  cta: string; href: string; highlighted: boolean; badge?: string;
}) {
  return (
    <div className={`rounded-2xl p-8 relative ${highlighted ? "gradient-border" : ""}`}
      style={{
        background: highlighted ? "var(--bg-elevated)" : "var(--bg-card)",
        border: highlighted ? undefined : "1px solid var(--border)",
        boxShadow: highlighted ? "var(--shadow-glow)" : undefined,
      }}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: "var(--gradient-primary)" }}>
          {badge}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>{price}</span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Check className="w-4 h-4 shrink-0" style={{ color: "var(--accent-success)" }} />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href}
        className="block w-full text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: highlighted ? "var(--gradient-primary)" : "transparent",
          color: highlighted ? "white" : "var(--text-primary)",
          border: highlighted ? "none" : "1px solid var(--border)",
        }}>
        {cta}
      </Link>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
