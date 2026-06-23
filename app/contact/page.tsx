'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Send, HelpCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'support',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: 'support', message: '' });
    // Reset success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <main className="min-h-screen bg-background font-mono text-on-surface p-6 lg:p-12 pt-32 max-w-5xl mx-auto relative selection:bg-primary/20">
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

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Contact details (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 flex flex-col gap-4"
        >
          {/* Card: Header */}
          <div className="grid-box p-6 bg-surface-container-low/40 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid-box p-2 bg-primary/5 border border-primary/20 rounded flex items-center justify-center text-primary">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-tight text-on-surface">Get in Touch</h1>
            </div>
            <p className="text-xs text-on-surface-variant/50 leading-relaxed font-sans">
              Have questions regarding subscriptions, technical problems, or competitive cheating bans? Transmit your query and our team will get back to you within 24 hours.
            </p>
          </div>

          {/* Card: Contact details */}
          <div className="grid-box p-6 bg-surface-container-low/20 rounded-xl space-y-6">
            {/* Email item */}
            <div className="flex gap-4">
              <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">Email Enquiries</div>
                <a href="mailto:apna.shashank.dev@gmail.com" className="text-xs font-bold hover:text-primary transition-colors mt-0.5 block">
                  apna.shashank.dev@gmail.com
                </a>
                <span className="text-[9px] text-on-surface-variant/20 uppercase tracking-wide mt-1 block">Response target: &lt; 24 Hours</span>
              </div>
            </div>

            {/* Address item */}
            <div className="flex gap-4">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">Registered Address</div>
                <p className="text-xs font-semibold leading-relaxed text-on-surface-variant/75 mt-1 font-sans">
                  Horse Typing Operations<br />
                  Gaurichak, Patna,<br />
                  Bihar, 800007, India
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact form (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7"
        >
          <div className="grid-box p-6 bg-surface-container-low/40 rounded-xl h-full flex flex-col justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4 mb-4">
              Send Transmission
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Row: Name and Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black/25 border border-white/8 rounded p-3 text-xs font-sans text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. john@domain.com"
                      className="w-full bg-black/25 border border-white/8 rounded p-3 text-xs font-sans text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-surface-container-highest border border-white/8 rounded p-3 text-xs font-sans text-on-surface focus:outline-none transition-colors"
                  >
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing &amp; Subscriptions</option>
                    <option value="report">Report Cheater/Leaderboard Ban</option>
                    <option value="business">Partnership/Feedback</option>
                  </select>
                </div>

                {/* Message input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Transmission Content</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue or feedback in detail..."
                    className="w-full bg-black/25 border border-white/8 rounded p-3 text-xs font-sans text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    success
                      ? 'bg-correct/10 text-correct border border-correct/20'
                      : loading
                      ? 'bg-primary/10 text-primary cursor-not-allowed border border-primary/25'
                      : 'bg-primary text-background hover:bg-primary/95 hover:scale-[1.01]'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Broadcasting...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Transmission Received
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Transmit Message
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {success && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] font-bold text-correct uppercase tracking-wider text-center sm:text-left"
                    >
                      Your query has been queued successfully. Check email for updates.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
