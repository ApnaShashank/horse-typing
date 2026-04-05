'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, Type as TypeIcon, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTypingEngine } from '../practice/useTypingEngine';

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState('time 15');

  const fetchLeaderboard = async (mode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?mode=${encodeURIComponent(mode)}`);
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentMode);
  }, [currentMode]);

  const modes = [
    { id: 'time 15', label: '15s' },
    { id: 'time 60', label: '60s' },
    { id: 'words 25', label: '25 Words' },
    { id: 'words 50', label: '50 Words' },
  ];

  return (
    <main className="min-h-screen bg-background font-mono text-on-surface p-6 lg:p-12 pt-24 max-w-6xl mx-auto selection:bg-primary/20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <Trophy className="w-8 h-8 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              <h1 className="text-4xl font-black font-['Manrope'] tracking-tight">World Rankings</h1>
           </div>
           <p className="text-on-surface-variant/60 max-w-xl text-sm leading-relaxed">
             Track the top performing typists globally. Results are filtered by standard competitive modes. 
             Can you break into the top 10?
           </p>
        </div>

        <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-white/5 shadow-lg">
           {modes.map(m => (
              <button 
                key={m.id}
                onClick={() => setCurrentMode(m.id)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${currentMode === m.id ? 'bg-primary text-[#323437] shadow-md shadow-primary/10Scale' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
              >
                {m.label}
              </button>
           ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
         <div className="grid grid-cols-12 px-8 py-5 border-b border-white/5 bg-surface-container-highest/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
            <div className="col-span-1">#</div>
            <div className="col-span-1"><Globe className="w-3 h-3" /></div>
            <div className="col-span-4 pl-4">Typist</div>
            <div className="col-span-2 text-center text-primary">WPM</div>
            <div className="col-span-2 text-center text-on-surface">Accuracy</div>
            <div className="col-span-2 text-right pr-4">Date</div>
         </div>

         <div className="divide-y divide-white/5 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></div>
                 </div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic">Gathering Data...</span>
              </div>
            ) : scores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-on-surface-variant/20 italic">
                 <Trophy className="w-12 h-12 mb-4 opacity-5" />
                 <p>No rankings for this mode yet.</p>
              </div>
            ) : scores.map((s, index) => (
              <div key={s.id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-white/[0.02] transition-colors group">
                 <div className="col-span-1 text-on-surface-variant font-bold text-sm">
                    {index < 3 ? (
                       <Medal className={`w-5 h-5 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                    ) : (
                       index + 1
                    )}
                 </div>
                 <div className="col-span-1 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-correct/40"></div>
                 </div>
                 <div className="col-span-4 pl-4 font-bold text-sm text-on-surface group-hover:text-primary transition-colors cursor-default">
                    {s.user?.name || 'Anonymous'}
                 </div>
                 <div className="col-span-2 text-center text-primary font-black text-xl">
                    {s.wpm}
                 </div>
                 <div className="col-span-2 text-center text-on-surface font-bold text-sm">
                    {s.accuracy}%
                 </div>
                 <div className="col-span-2 text-right pr-4 text-xs text-on-surface-variant opacity-40">
                    {new Date(s.createdAt).toLocaleDateString()}
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="mt-12 flex justify-center">
         <Link href="/practice" className="flex items-center gap-2 px-8 py-3 bg-surface-container-highest border border-white/5 rounded-xl hover:bg-white/5 transition-all group">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Return to practice</span>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </main>
  );
}
