'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Type } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/practice');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 tracking-wide font-mono bg-background mt-16 overflow-hidden">
      <div className="w-full max-w-md relative">
        {/* Decorative Grid Background for Form */}
        <div className="absolute -inset-4 opacity-20 pointer-events-none">
          <div className="w-full h-full grid-lines-hero border border-white/5" />
        </div>

        <div className="grid-box border-white/10 bg-zinc-950/80 p-10 md:p-14 relative overflow-hidden group">
          {/* Top Status Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-primary" 
            />
          </div>

          <div className="flex flex-col items-center mb-12">
            <div className="grid-box w-12 h-12 bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-all">
              <Type className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-on-surface mb-3">Authenticate</h1>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Identity Submission Required
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-error-dim/10 border border-error-dim/30 text-error text-[10px] font-black uppercase tracking-[0.2em] text-center"
            >
              System Error: {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">Access Key (Email)</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/20 group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 outline-none rounded-[2px] py-4 pl-12 pr-4 text-xs text-on-surface focus:border-primary/40 focus:bg-black/60 transition-all font-mono"
                  placeholder="ID@HORSETYPING.COM"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">Security Token (Password)</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/20 group-focus-within/input:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 outline-none rounded-[2px] py-4 pl-12 pr-4 text-xs text-on-surface focus:border-primary/40 focus:bg-black/60 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full grid-box bg-primary/10 border-primary/40 text-primary font-black py-5 text-[11px] uppercase tracking-[0.4em] hover:bg-primary/20 active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-50 mt-4 overflow-hidden relative"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  Boot Session <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">
              Unregistered Identity? <Link href="/register" className="text-primary hover:text-primary-dim transition-colors">Initialize here</Link>
            </p>
            <Link href="/practice" className="text-[9px] font-bold text-on-surface-variant/20 hover:text-on-surface-variant/40 uppercase tracking-[0.4em] transition-colors">
              Abort to Practice Module
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
