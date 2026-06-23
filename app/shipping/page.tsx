'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Truck, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPolicy() {
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
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-['Manrope'] tracking-tight uppercase">Shipping &amp; Delivery</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Support: apna.shashank.dev@gmail.com</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="grid-box p-8 bg-surface-container-low/40 rounded-xl space-y-8 text-sm leading-relaxed text-on-surface/80 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">1. Nature of Services</h2>
            <p>
              Horse Typing is a software-as-a-service (SaaS) web-based application. We do not manufacture, package, ship, or deliver any physical goods.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">2. Delivery Timeframe</h2>
            <p>
              All premium features included in the Pro Coach subscription plan are delivered **instantly and electronically**:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant/80">
              <li>Upon successful transaction confirmation from Razorpay, your account status is automatically upgraded to &quot;Pro&quot;.</li>
              <li>Activation takes place within **1 to 5 seconds** of payment completion.</li>
              <li>You do not need to download or install any external components. Simply refresh your session or return to the Practice/Learn modules to access your unlocked assets.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">3. Shipping Fees</h2>
            <p>
              Since the delivery of the services is digital and completed via web endpoints, there are **no shipping or packaging charges** applicable to any of our plans.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase font-mono tracking-widest text-primary">4. Delivery Failures &amp; Support</h2>
            <p>
              In rare instances where a transaction succeeds but the Pro feature set remains locked due to connection timeouts:
            </p>
            <p className="text-on-surface-variant/80">
              Please email apna.shashank.dev@gmail.com with your payment receipt and registered email. We will manually verify the invoice and sync your status within **12 hours**.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-bold">
          Horse Typing Digital Logistics Division
        </div>
      </motion.div>
    </main>
  );
}
