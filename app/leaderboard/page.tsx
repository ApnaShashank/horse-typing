'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
        setScores(data.scores || []);
      }
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
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
    <main className="min-h-screen bg-background font-mono text-on-surface p-6 lg:p-12 pt-36 max-w-6xl mx-auto selection:bg-primary/20 relative">
      {/* Background blurs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="grid-box p-2 bg-primary/5 border border-primary/20 rounded flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(153,153,153,0.3)]" />
            </div>
            <h1 className="text-3xl font-black font-['Manrope'] tracking-tight uppercase">Global Rankings</h1>
          </div>
          <p className="text-on-surface-variant/40 max-w-xl text-xs leading-relaxed uppercase tracking-wider">
            Track the top performing typists globally. Results are filtered by standard competitive modes.
          </p>
        </div>

        <div className="flex bg-surface-container-low p-1.5 rounded-lg border border-white/5 shadow-lg select-none">
          {modes.map(m => (
            <button 
              key={m.id}
              onClick={() => setCurrentMode(m.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer ${
                currentMode === m.id 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-md' 
                  : 'text-on-surface-variant/50 hover:text-on-surface hover:bg-white/5 border border-transparent'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full bg-surface-container-low border border-white/5 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.01] grid-lines-hero pointer-events-none" />
        
        <div className="grid grid-cols-12 px-6 py-5 border-b border-white/5 bg-white/2 text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">
          <div className="col-span-2 sm:col-span-1">Rank</div>
          <div className="col-span-1 hidden sm:flex justify-center"><Globe className="w-3.5 h-3.5" /></div>
          <div className="col-span-6 sm:col-span-4 pl-2 md:pl-4">Typist</div>
          <div className="col-span-2 text-center text-primary">WPM</div>
          <div className="col-span-2 text-center">Accuracy</div>
          <div className="col-span-2 hidden sm:block text-right pr-4">Date</div>
        </div>

        <div className="divide-y divide-white/5 min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[400px] gap-4"
              >
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce delay-150"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce delay-300"></div>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic">Loading telemetry...</span>
              </motion.div>
            ) : scores.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[400px] text-on-surface-variant/20 italic"
              >
                <Trophy className="w-12 h-12 mb-4 opacity-5" />
                <p className="text-xs uppercase tracking-widest font-bold">No rankings for this mode yet.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="divide-y divide-white/5"
              >
                {scores.map((s, index) => (
                  <motion.div 
                    key={s.id} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
                    className="grid grid-cols-12 px-6 py-4.5 items-center transition-colors group cursor-default"
                  >
                    <div className="col-span-2 sm:col-span-1 text-on-surface-variant font-bold text-sm">
                      {index < 3 ? (
                        <Medal className={`w-5 h-5 ${index === 0 ? 'text-yellow-500 filter drop-shadow-[0_0_6px_rgba(234,179,8,0.3)]' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                      ) : (
                        <span className="text-xs opacity-40 ml-1.5">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-1 hidden sm:flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-correct/60"></div>
                    </div>
                    <div className="col-span-6 sm:col-span-4 pl-2 md:pl-4 font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors truncate uppercase tracking-wider">
                      {s.user?.name || 'Anonymous'}
                    </div>
                    <div className="col-span-2 text-center text-primary font-black text-sm sm:text-base md:text-lg">
                      {s.wpm.toFixed(1)}
                    </div>
                    <div className="col-span-2 text-center text-on-surface font-bold text-xs sm:text-sm">
                      {s.accuracy}%
                    </div>
                    <div className="col-span-2 hidden sm:block text-right pr-4 text-[10px] font-bold text-on-surface-variant opacity-30">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/practice" className="flex items-center gap-3 px-8 py-3.5 bg-surface-container-highest border border-white/5 rounded hover:bg-white/5 transition-all group">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Return to practice</span>
          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </main>
  );
}
