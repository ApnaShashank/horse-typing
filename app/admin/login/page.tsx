'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, RefreshCw, KeyRound, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-mono">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(147,51,234,0.06) 0%, transparent 65%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md grid-box p-8 bg-surface-container-low border border-white/8 rounded-2xl shadow-2xl relative"
      >
        <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-background text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
          <KeyRound className="w-2.5 h-2.5" /> SECURE ROOT
        </div>

        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-on-surface">Admin Terminal</h1>
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            Enter administrative credentials to sign in
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-on-surface-variant/40" /> Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@horsetyping"
              className="w-full bg-black/35 border border-white/8 rounded-xl p-3.5 text-xs text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/45 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-on-surface-variant/40" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/35 border border-white/8 rounded-xl p-3.5 text-xs text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/45 transition-colors"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-error/10 border border-error/25 text-error rounded-xl flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-error/85" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-background hover:bg-primary/95 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center min-h-[44px]"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
