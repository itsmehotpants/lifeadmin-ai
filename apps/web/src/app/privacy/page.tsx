import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-gray-400">Last Updated: April 18, 2026</p>
        </div>

        <div className="space-y-12 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>Welcome to LifeAdmin AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li><strong>Identity Data:</strong> includes name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Life Data:</strong> includes tasks, habits, financial milestones, and goals sent to our AI engine.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, login data, browser type and version, and platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
            <p>We use your data to provide the "LifeAdmin" experience. Specifically:</p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>To parse and structure your life events using our Gemini-powered AI engine.</li>
              <li>To calculate your discipline scores and behavioral profile.</li>
              <li>To send you push notifications about upcoming consequences (overdue bills, broken habits).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. AI Processing</h2>
            <p>Data provided for task parsing is processed via Gemini 2.0. We do not use your personal life data to train generalized models. Your data is your own.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@lifeadmin.ai" className="text-indigo-400 hover:underline">privacy@lifeadmin.ai</a></p>
          </section>
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 text-sm text-gray-500 text-center">
          &copy; 2026 LifeAdmin AI. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
