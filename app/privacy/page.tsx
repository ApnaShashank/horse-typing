'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const lastUpdated = "June 23, 2026";

  return (
    <main className="min-h-screen bg-background font-mono text-on-surface p-6 lg:p-12 pt-32 max-w-4xl mx-auto relative selection:bg-primary/20">
      {/* Background blurs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 opacity-[0.02] grid-lines-hero pointer-events-none -z-10" />

      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant/50 hover:text-on-surface transition-colors mb-8 group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Return to base</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="grid-box p-2.5 bg-primary/5 border border-primary/25 rounded flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-['Manrope'] tracking-tight uppercase">Privacy Policy</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Support: apna.shashank.dev@gmail.com</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="grid-box p-8 bg-surface-container-low/40 rounded-xl space-y-8 text-sm leading-relaxed text-on-surface/80 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">1. Introduction</h2>
            <p>
              Welcome to Horse Typing. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, process, and protect your information when you use our website and services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when registering for a free or Pro account:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li><strong>Account Credentials:</strong> Your username, email address, and hashed password.</li>
              <li><strong>Typing Metrics & Telemetry:</strong> Words per minute (WPM), accuracy, raw typing speed, mistake counts, and weak keys collected during practice runs.</li>
              <li><strong>Subscription Details:</strong> Order details associated with Razorpay payment processing (we do not store actual card details).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">3. How We Use Your Information</h2>
            <p>
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Deliver your personal typing stats, performance progression, and leaderboard rankings.</li>
              <li>Enable AI diagnostic tools to pinpoint keystroke latency and suggest helpful curriculum lessons.</li>
              <li>Process premium subscription orders securely and activate Pro features.</li>
              <li>Maintain and optimize our application security and server stability.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">4. Cookies and Local Storage</h2>
            <p>
              We use local storage keys (such as theme configuration and typing progress details) to improve and save your offline guest experience. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">5. Security of Your Data</h2>
            <p>
              We implement technical and organizational security measures to prevent unauthorized access or modification of your data. Hashed credentials are stored in secure cloud databases.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">6. Third-Party Payments</h2>
            <p>
              We process subscription upgrades through Razorpay. All transaction communications are secured under Standard SSL connections. We do not inspect or store credit card, debit card, or net banking authentication details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">7. Your Rights and Choices</h2>
            <p>
              You can view, modify, or delete your account records directly in your profile settings, or request full data deletion by contacting us at apna.shashank.dev@gmail.com.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-bold">
          Horse Typing Compliance &amp; Security Division
        </div>
      </motion.div>
    </main>
  );
}
