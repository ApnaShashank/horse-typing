'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-['Manrope'] tracking-tight uppercase">Terms &amp; Conditions</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Support: apna.shashank.dev@gmail.com</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="grid-box p-8 bg-surface-container-low/40 rounded-xl space-y-8 text-sm leading-relaxed text-on-surface/80 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">1. Agreement to Terms</h2>
            <p>
              By accessing or using Horse Typing, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">2. User Accounts</h2>
            <p>
              To access historical statistics, progression tracking, and submit scores to our global leaderboard, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Providing accurate account information.</li>
              <li>Keeping your password secure and not sharing access to your profile.</li>
              <li>Notifying us immediately of any unauthorized usage of your account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">3. Fair Play &amp; Conduct Rules</h2>
            <p>
              Competitive integrity is essential to our typing platform. By practicing on Horse Typing, you agree that you will not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Use automation tools, bots, auto-clickers, or scripts to simulate typing keystrokes.</li>
              <li>Artificially manipulate test results to cheat your WPM/accuracy on the global leaderboards.</li>
              <li>Scrape website content or database tables for secondary usage.</li>
            </ul>
            <p className="text-on-surface-variant/80">
              Any accounts found using scripts or cheating will have their scores deleted and access revoked immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">4. Payments &amp; Pro Subscriptions</h2>
            <p>
              We offer free access to standard tests and lessons. We offer premium upgrades (Pro Coach) which unlock custom prompt generation, advanced AI diagnostic tools, and custom visual themes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Subscription charges are billed monthly via Razorpay.</li>
              <li>Rates are clearly communicated at checkout ($5 per month or equivalent local currency).</li>
              <li>You may cancel your auto-renewal subscription at any time through your profile options or payment dashboard.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">5. Intellectual Property</h2>
            <p>
              The design layout, customized typing curricula, software engines, custom visual keyboard profiles, logos, and features of Horse Typing are the intellectual property of ApnaShashank and protected by copyright laws. You may not reproduce, copy, or redistribute any assets without prior consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">6. Limitation of Liability</h2>
            <p>
              Horse Typing is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no warranty that our service will be uninterrupted, error-free, or secure. We are not liable for any loss of database records, stats progress, or transaction disputes beyond direct subscriptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">7. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any legal claims or disputes regarding subscriptions or cheating bans shall be submitted to the exclusive jurisdiction of the courts in Patna, Bihar.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-bold">
          Horse Typing Legal Framework Division
        </div>
      </motion.div>
    </main>
  );
}
