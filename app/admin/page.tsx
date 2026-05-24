'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Settings, Shield, Power, BarChart, CheckCircle2,
  Crown, Sparkles, BookOpen, Clock, Search, RefreshCw,
  Key, HelpCircle, Save, ExternalLink
} from 'lucide-react';

type UserDetail = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isPro: boolean;
  aiPracticeCount: number;
  completedLessons: number[];
  practiceRunsCount: number;
  userStat: {
    avgWpm: number;
    bestWpm: number;
    avgAccuracy: number;
    totalTests: number;
  } | null;
  testResults: {
    mode: string;
    wpm: number;
    accuracy: number;
    createdAt: string;
  }[];
};

type SystemConfigType = {
  freeAiLimit: number;
  freeLearnLimit: number;
  freePracticeLimitBeforeLogin: number;
};

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [config, setConfig] = useState<SystemConfigType>({
    freeAiLimit: 3,
    freeLearnLimit: 5,
    freePracticeLimitBeforeLogin: 3
  });

  // Editing state for limits
  const [freeAiLimit, setFreeAiLimit] = useState(3);
  const [freeLearnLimit, setFreeLearnLimit] = useState(5);
  const [freePracticeLimitBeforeLogin, setFreePracticeLimitBeforeLogin] = useState(3);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'practiceRuns' | 'wpm'>('newest');

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  // Authentication check & initial fetch
  useEffect(() => {
    async function init() {
      try {
        const checkRes = await fetch('/api/admin/check');
        if (!checkRes.ok) {
          router.push('/admin/login');
          return;
        }
        setAuthorized(true);

        // Fetch users and config
        const [usersRes, configRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/config')
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
        if (configRes.ok) {
          const configData = await configRes.json();
          const loadedConfig = configData.config;
          if (loadedConfig) {
            setConfig(loadedConfig);
            setFreeAiLimit(loadedConfig.freeAiLimit);
            setFreeLearnLimit(loadedConfig.freeLearnLimit);
            setFreePracticeLimitBeforeLogin(loadedConfig.freePracticeLimitBeforeLogin);
          }
        }
      } catch (err) {
        console.error(err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeAiLimit,
          freeLearnLimit,
          freePracticeLimitBeforeLogin
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.config);
        setToast({ type: 'success', message: 'Settings updated successfully!' });
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to update settings.' });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Error communicating with server.' });
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter & sort users
  const filteredUsers = users
    .filter(user => {
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier =
        tierFilter === 'all' ||
        (tierFilter === 'pro' && user.isPro) ||
        (tierFilter === 'free' && !user.isPro);
      return matchSearch && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'practiceRuns') {
        return b.practiceRunsCount - a.practiceRunsCount;
      }
      if (sortBy === 'wpm') {
        const wpmA = a.userStat?.bestWpm || 0;
        const wpmB = b.userStat?.bestWpm || 0;
        return wpmB - wpmA;
      }
      return 0;
    });

  const totalUsersCount = users.length;
  const proUsersCount = users.filter(u => u.isPro).length;
  const freeUsersCount = totalUsersCount - proUsersCount;

  if (authorized === null || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-mono text-on-surface">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Loading Administrative Core...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono text-on-surface flex flex-col pt-14">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(147,51,234,0.03) 0%, transparent 60%)'
        }} />
      </div>

      {/* Admin Nav */}
      <header className="fixed top-0 left-0 w-full h-14 bg-background/80 backdrop-blur-xl border-b border-white/8 z-50 px-5 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-on-surface">Admin Terminal</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-error/20 bg-error/5 hover:bg-error/10 hover:border-error/30 text-error text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          <Power className="w-3.5 h-3.5" /> LOGOUT
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-5 lg:px-10 py-10 w-full flex-1 space-y-8">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: totalUsersCount, icon: <Users className="w-4 h-4" />, color: 'text-on-surface' },
            { label: 'Pro Members', value: proUsersCount, icon: <Crown className="w-4 h-4 text-primary" />, color: 'text-primary' },
            { label: 'Free Members', value: freeUsersCount, icon: <CheckCircle2 className="w-4 h-4 text-correct" />, color: 'text-correct' }
          ].map(s => (
            <div key={s.label} className="grid-box p-6 bg-surface-container-low/40 border border-white/6 rounded-2xl relative flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">{s.label}</span>
                <h3 className={`text-3xl font-black mt-2 leading-none ${s.color}`}>{s.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/3 border border-white/5 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
            </div>
          ))}
        </section>

        {/* Dashboard Tools & Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Paywalls Threshold Setting Form */}
          <section className="lg:col-span-2 grid-box p-6 bg-surface-container-low/30 border border-white/6 rounded-2xl space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Settings className="w-4 h-4" /> Paywall limits & configuration
            </h3>
            <p className="text-[10px] text-on-surface-variant/40 leading-relaxed font-sans max-w-xl">
              Configure free usage thresholds before paywalls are shown. Pro subscription members bypass all limitations automatically.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Free AI Practice Limit
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={freeAiLimit}
                    onChange={(e) => setFreeAiLimit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/35 border border-white/8 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary/50"
                  />
                  <span className="text-[8px] text-on-surface-variant/25 uppercase font-bold block">Free AI requests allowed</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Free Learn Limit
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={freeLearnLimit}
                    onChange={(e) => setFreeLearnLimit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/35 border border-white/8 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary/50"
                  />
                  <span className="text-[8px] text-on-surface-variant/25 uppercase font-bold block">Lessons allowed for free</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Practice Runs before login
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={freePracticeLimitBeforeLogin}
                    onChange={(e) => setFreePracticeLimitBeforeLogin(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-black/35 border border-white/8 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary/50"
                  />
                  <span className="text-[8px] text-on-surface-variant/25 uppercase font-bold block">Guest practice runs allowed</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-3 rounded-xl bg-primary text-background hover:bg-primary/95 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Configurations
                </button>
              </div>
            </form>
          </section>

          {/* Vercel Analytics Box */}
          <section className="grid-box p-6 bg-surface-container-low/30 border border-white/6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <BarChart className="w-4 h-4" /> Vercel Analytics
              </h3>
              <p className="text-xs text-on-surface-variant/60 leading-relaxed font-sans">
                Real-time page views, conversion stats, and performance ratings are monitored through Vercel. 
              </p>
              <div className="p-3 bg-white/[0.015] border border-white/4 rounded-xl">
                <div className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant/30">Analytics Status</div>
                <div className="text-xs font-black text-correct uppercase mt-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-correct animate-pulse" /> Active & Live
                </div>
              </div>
            </div>
            
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
            >
              Vercel Dashboard <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

        </div>

        {/* User Stats Table Card */}
        <section className="grid-box p-6 bg-surface-container-low/20 border border-white/6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Registered User Database</h3>
              <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest mt-1">Monitor typing progress and feature usage</p>
            </div>

            {/* Filtering controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/30" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-black/25 border border-white/6 rounded-lg text-xs focus:outline-none focus:border-primary/50 w-44 md:w-56"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e: any) => setTierFilter(e.target.value)}
                className="bg-black/25 border border-white/6 text-[10px] font-black uppercase tracking-wider rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free Users</option>
                <option value="pro">Pro Members</option>
              </select>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-black/25 border border-white/6 text-[10px] font-black uppercase tracking-wider rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="newest">Sort: Newest</option>
                <option value="practiceRuns">Sort: Practice Runs</option>
                <option value="wpm">Sort: Highest WPM</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30">
                  <th className="py-4 px-4">User Details</th>
                  <th className="py-4 px-4 text-center">Tier</th>
                  <th className="py-4 px-4 text-center">AI Custom Practiced</th>
                  <th className="py-4 px-4 text-center">Lessons Practiced</th>
                  <th className="py-4 px-4 text-center">Practice Runs</th>
                  <th className="py-4 px-4 text-center">Speed (Avg/Best)</th>
                  <th className="py-4 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => {
                    const avgWpm = user.userStat ? Math.round(user.userStat.avgWpm) : '—';
                    const bestWpm = user.userStat ? user.userStat.bestWpm : '—';
                    const avgAcc = user.userStat ? Math.round(user.userStat.avgAccuracy) : '—';
                    
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.015] transition-colors text-xs">
                        {/* User identity */}
                        <td className="py-4.5 px-4">
                          <div>
                            <div className="font-bold text-on-surface/90">{user.name}</div>
                            <div className="text-[10px] text-on-surface-variant/35 mt-0.5">{user.email}</div>
                          </div>
                        </td>

                        {/* Tier */}
                        <td className="py-4.5 px-4 text-center">
                          {user.isPro ? (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                              PRO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest bg-white/4 border border-white/5 px-2 py-0.5 rounded">
                              FREE
                            </span>
                          )}
                        </td>

                        {/* AI count */}
                        <td className="py-4.5 px-4 text-center font-bold text-on-surface/80">
                          {user.aiPracticeCount}
                        </td>

                        {/* Lessons Completed */}
                        <td className="py-4.5 px-4 text-center">
                          <div>
                            <span className="font-bold text-on-surface/80">{user.completedLessons.length}</span>
                            {user.completedLessons.length > 0 && (
                              <div className="text-[8px] font-bold text-on-surface-variant/25 uppercase tracking-wider mt-0.5 max-w-[150px] mx-auto truncate" title={`Completed lessons: ${user.completedLessons.join(', ')}`}>
                                Levels: {user.completedLessons.sort((a,b)=>a-b).join(', ')}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Practice Runs */}
                        <td className="py-4.5 px-4 text-center font-bold text-on-surface/80">
                          {user.practiceRunsCount}
                        </td>

                        {/* WPM Stats */}
                        <td className="py-4.5 px-4 text-center">
                          <div>
                            <span className="font-bold text-primary">{avgWpm}</span>
                            <span className="text-on-surface-variant/20 mx-1">/</span>
                            <span className="font-black text-correct">{bestWpm}</span>
                            <span className="text-[8px] font-bold text-on-surface-variant/35 uppercase tracking-widest block mt-0.5">WPM</span>
                          </div>
                        </td>

                        {/* Registered Date */}
                        <td className="py-4.5 px-4 text-right text-on-surface-variant/40 text-[10px] font-semibold">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant/25 italic">
                      No users matched the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Global Alerts Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-white/8 flex items-center gap-3 shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-correct/10 border-correct/30 text-correct'
                : 'bg-error/10 border-error/30 text-error'
            }`}
          >
            <div className="text-xs font-black tracking-wide">{toast.message}</div>
            <button onClick={() => setToast(null)} className="text-[10px] font-black uppercase hover:opacity-75 transition-opacity">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
