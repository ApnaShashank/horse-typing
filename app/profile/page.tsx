'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, Activity, History, Clock, Target, Trash2, ChevronRight, User as UserIcon, AlertTriangle, TrendingUp, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const json = await res.json();
        setData(json.user);
      } else {
        router.push('/login');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></span>
         </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = data.userStat || {};
  const history = data.testResults || [];
  const mistakes = data.mistakes || [];

  return (
    <main className="min-h-screen bg-background font-mono text-on-surface p-6 lg:p-12 pt-24 max-w-6xl mx-auto selection:bg-primary/20">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 px-4">
         <div className="w-32 h-32 rounded-3xl bg-surface-container-low border border-white/5 flex items-center justify-center text-primary relative overflow-hidden shadow-2xl">
            <UserIcon className="w-16 h-16 relative z-10" />
            <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
         </div>
         <div className="flex-grow space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-black font-['Manrope'] tracking-tight text-on-surface uppercase">{data.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Joined {new Date(data.createdAt).toLocaleDateString()}</span>
               <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block"></span>
               <span className="flex items-center gap-1.5 text-primary"><Trophy className="w-3.5 h-3.5" /> Rank: Elite Typist</span>
            </div>
         </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         {[
           { label: 'best wpm', value: stats.bestWpm, icon: <Trophy className="w-4 h-4" />, color: 'text-primary' },
           { label: 'avg wpm', value: Math.round(stats.avgWpm), icon: <Activity className="w-4 h-4" />, color: 'text-on-surface' },
           { label: 'accuracy', value: `${Math.round(stats.avgAccuracy)}%`, icon: <Target className="w-4 h-4" />, color: 'text-correct' },
           { label: 'total tests', value: stats.totalTests, icon: <History className="w-4 h-4" />, color: 'text-on-surface-variant' },
         ].map((stat, i) => (
           <div key={i} className="bg-surface-container-low border border-white/5 p-6 rounded-2xl shadow-lg group hover:border-primary/20 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/40">{stat.label}</span>
                 <div className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
              </div>
              <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Logic Placeholder (History) */}
         <div className="lg:col-span-2 space-y-8">
            <section>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                     <TrendingUp className="w-4 h-4 text-primary" />
                     WPM Progression
                  </h3>
               </div>
               <div className="w-full h-64 bg-surface-container-low border border-white/5 rounded-2xl relative p-8 shadow-xl flex items-end justify-between gap-1 overflow-hidden">
                  {history.length > 0 ? history.slice(0, 30).reverse().map((h: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex-grow bg-primary/20 border-t-2 border-primary rounded-t-sm group relative"
                      style={{ height: `${(h.wpm / (stats.bestWpm || 100)) * 100}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/5">
                          {h.wpm} wpm
                       </div>
                    </div>
                  )) : (
                     <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-white/5 italic">Not enough data to graph</div>
                  )}
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-5">
                     <div className="w-full h-px bg-white"></div>
                     <div className="w-full h-px bg-white"></div>
                     <div className="w-full h-px bg-white"></div>
                  </div>
               </div>
            </section>

            {/* History Table */}
            <section>
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  <History className="w-4 h-4" />
                  Recent Activity
               </h3>
               <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-surface-container-highest/30 text-[9px] uppercase font-black tracking-widest text-on-surface-variant/40">
                           <th className="px-6 py-4">wpm</th>
                           <th className="px-6 py-4">accuracy</th>
                           <th className="px-6 py-4">mode</th>
                           <th className="px-6 py-4 text-right">date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {history.length > 0 ? history.slice(0, 10).map((h: any) => (
                           <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                 <span className="text-lg font-black text-primary">{h.wpm}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-xs font-bold text-correct">{h.accuracy}%</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">{h.mode}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className="text-[10px] font-medium text-on-surface-variant/30">{new Date(h.createdAt).toLocaleDateString()}</span>
                              </td>
                           </tr>
                        )) : (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic">No tests found</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </section>
         </div>

         {/* Sidebar: Weak Keys */}
         <div className="space-y-8">
            <section>
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  <AlertTriangle className="w-4 h-4 text-error" />
                  Weak Points
               </h3>
               <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                  {mistakes.length > 0 ? mistakes.map((m: any) => (
                    <div key={m.keyPressed} className="space-y-1.5">
                       <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-on-surface">Key: <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-white/10">{m.keyPressed}</kbd></span>
                          <span className="text-error">{m.count} miss</span>
                       </div>
                       <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div 
                           className="h-full bg-error transition-all duration-1000" 
                           style={{ width: `${(m.count / (mistakes[0].count || 1)) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                  )) : (
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic py-10 text-center">Perfect form. No weak keys found.</p>
                  )}
               </div>
            </section>

            <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl text-center">
               <h3 className="text-xs font-black uppercase underline decoration-primary/40 underline-offset-4 tracking-widest mb-4">Mastery Status</h3>
               <div className="flex items-center justify-center p-4">
                  <div className="p-4 bg-primary/20 rounded-full border border-primary/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
               </div>
               <p className="text-[11px] font-sans font-medium text-on-surface-variant/80 mt-2">
                  You are faster than <span className="text-primary font-black">74%</span> of other global typists in <span className="text-on-surface font-bold">time 60</span> mode.
               </p>
            </section>
         </div>
      </div>

      <div className="mt-20 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex gap-8 items-center opacity-30">
            <Link href="/practice" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Practice</Link>
            <Link href="/leaderboard" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Leaderboard</Link>
            <Link href="/learn" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Learn</Link>
         </div>

         <button 
           onClick={() => {
              if (window.confirm("Warning: This will delete all your typing history. Are you sure?")) {
                 alert("Bhai, feature development me hai. Stay tuned!");
              }
           }}
           className="flex items-center gap-2 group transform hover:scale-105 transition-all"
         >
            <div className="p-2 bg-error-dim/10 rounded-lg text-error group-hover:bg-error group-hover:text-[#323437] transition-all">
               <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-error opacity-40 group-hover:opacity-100 transition-opacity">Delete History</span>
         </button>
      </div>
    </main>
  );
}
