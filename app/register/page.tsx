'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/practice');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 tracking-wide font-mono bg-background mt-14 overflow-hidden relative">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right,#ffffff02 1px,transparent 1px),linear-gradient(to bottom,#ffffff02 1px,transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md relative">
        <div className="grid-box border-white/10 bg-zinc-950/80 p-6 sm:p-8 md:p-12 relative overflow-hidden group shadow-2xl">
          {/* Top Status/Glow Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-primary" 
            />
          </div>

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="grid-box p-0 overflow-hidden bg-primary/5 mb-5 group-hover:bg-primary/10 transition-all border-primary/20 flex items-center justify-center w-14 h-14">
              <img 
                src="https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png" 
                alt="Horse Typing Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-on-surface mb-2">Create Account</h1>
            <p className="text-center text-[11px] font-medium text-on-surface-variant/50 max-w-xs leading-relaxed">
              Join Horse Typing to save your history, analyze typing mistakes, and place on the global leaderboard.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error-dim/10 border border-error-dim/20 text-error text-[10px] font-bold uppercase tracking-widest text-center rounded"
            >
              Error: {error}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Username</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/20 group-focus-within/input:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 outline-none rounded py-3.5 pl-12 pr-4 text-xs text-on-surface focus:border-primary/40 focus:bg-black/60 transition-all font-mono placeholder:text-on-surface-variant/25"
                  placeholder="alex_key"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/20 group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 outline-none rounded py-3.5 pl-12 pr-4 text-xs text-on-surface focus:border-primary/40 focus:bg-black/60 transition-all font-mono placeholder:text-on-surface-variant/25"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/20 group-focus-within/input:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 outline-none rounded py-3.5 pl-12 pr-4 text-xs text-on-surface focus:border-primary/40 focus:bg-black/60 transition-all font-mono placeholder:text-on-surface-variant/25"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full grid-box bg-primary/10 border-primary/40 text-primary font-black py-4 text-[11px] uppercase tracking-widest hover:bg-primary/20 active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-50 mt-2 cursor-pointer shadow-lg shadow-black/20"
            >
              {loading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  Register <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider">
              Already have an account? <Link href="/login" className="text-primary hover:text-primary-dim transition-colors ml-1">Sign In</Link>
            </p>
            <Link href="/practice" className="text-[9px] font-bold text-on-surface-variant/20 hover:text-on-surface-variant/40 uppercase tracking-widest transition-colors">
              Back to Practice Module
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
