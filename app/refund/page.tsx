'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicy() {
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
              <RefreshCw className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-['Manrope'] tracking-tight uppercase">Refund &amp; Cancellations</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Support: apna.shashank.dev@gmail.com</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="grid-box p-8 bg-surface-container-low/40 rounded-xl space-y-8 text-sm leading-relaxed text-on-surface/80 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">1. Subscription Cancellation</h2>
            <p>
              You can cancel your Horse Typing Pro subscription at any time. When you cancel:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Your premium features (AI diagnostic tools, custom prompts, custom visual keyboards) will remain active until the end of your current paid billing cycle.</li>
              <li>You will not be charged for the following months.</li>
              <li>Cancellation can be processed directly via your Profile Settings.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">2. Refund Terms</h2>
            <p>
              Because Horse Typing Pro offers digital credits and instant access to LLM-powered custom prompt generation, we generally enforce a **no-refund policy** once features have been used. However, we want you to have a positive experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li><strong>Accidental Renewals:</strong> If you did not intend to renew your subscription and request a refund within **24 hours** of the transaction, we will process a full refund, provided no premium prompts have been generated during that period.</li>
              <li><strong>Service Downtime:</strong> If our systems undergo prolonged outages that prevent you from utilizing the service, we will offer partial/pro-rata refunds.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">3. Refund Timelines &amp; Processing</h2>
            <p>
              When a refund is approved by our compliance team:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>The transaction refund will be initiated back to your original source payment method (Credit/Debit Card, UPI, or Net Banking).</li>
              <li>Payment gateways (Razorpay) typically take **5 to 7 business days** to settle the refund amount into your bank account.</li>
              <li>You will receive an email confirmation from both Razorpay and Horse Typing upon successful initiation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">4. Duplicate Charges</h2>
            <p>
              In the event that you are charged twice for the same billing cycle due to network interruptions or gateway hiccups, please send a mail to apna.shashank.dev@gmail.com with your Order ID. We will review the logs and return the excess charge within 24 hours.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-bold">
          Horse Typing Accounts &amp; Billing Division
        </div>
      </motion.div>
    </main>
  );
}
