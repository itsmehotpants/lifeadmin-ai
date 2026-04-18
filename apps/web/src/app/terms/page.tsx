import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">L</div>
            <span className="text-white font-bold tracking-tight">LifeAdmin <span className="text-indigo-500">AI</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-white transition-colors">Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-gray-400">Last Updated: April 18, 2026</p>
        </div>

        <div className="space-y-12 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using LifeAdmin AI, you agree to be bound by these terms. If you do not agree to all of these terms, do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>LifeAdmin AI is a personal life management platform that uses artificial intelligence to help users track tasks, habits, and financial milestones. We provide automated reminders and behavioral insights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibility</h2>
            <p>You are responsible for keeping your password secure and for all activities that occur under your account. You agree not to use the service for any illegal or unauthorized purpose.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payments</h2>
            <p>Certain features require a paid subscription (PRO or PREMIUM). By subscribing, you agree to pay the fees associated with your chosen plan. All payments are processed via Stripe or Razorpay.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>LifeAdmin AI is provided "as is". We are not responsible for any missed deadlines, financial penalties, or emotional distress resulting from the use or failure of the service. You use the service at your own risk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. AI Disclosure</h2>
            <p>Our AI features use Gemini 2.0. While highly capable, AI can make mistakes. Always verify critical information (e.g., bill amounts or due dates) manually.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law</h2>
            <p>These terms shall be governed by the laws of India, without regard to its conflict of law provisions.</p>
          </section>
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 text-sm text-gray-500 text-center">
          &copy; 2026 LifeAdmin AI. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
