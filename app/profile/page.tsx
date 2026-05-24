'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, Activity, History, Clock, Target, Trash2, User as UserIcon, 
  AlertTriangle, TrendingUp, BarChart3, Sparkles, Brain, BookOpen, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LESSONS, KEY_FINGER_MAP, FINGER_DISPLAY_NAMES, getDifficultyColor, type Lesson } from '@/app/learn/lessonData';

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState('');
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
    // Load saved AI diagnostic from local storage
    const saved = localStorage.getItem('ht_typing_diagnostic');
    if (saved) {
      try {
        setAiAnalysis(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleAIAnalysis = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setDiagnosticStep('Initializing connection to AI Typing Coach...');

    const steps = [
      'Scanning recent speed curves...',
      'Correlating keystroke latency anomalies...',
      'Mapping layout finger mistakes...',
      'Synthesizing curriculum recommendations...',
      'Generating custom focus suggestions...'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setDiagnosticStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 1000);

    try {
      const res = await fetch('/api/profile/analyze', { method: 'POST' });
      clearInterval(interval);
      if (res.ok) {
        const json = await res.json();
        setAiAnalysis(json);
        localStorage.setItem('ht_typing_diagnostic', JSON.stringify(json));
      } else {
        alert('Could not compile typing analysis. Make sure you completed at least one test!');
      }
    } catch (e) {
      console.error(e);
      alert('Error fetching AI diagnostic details.');
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce delay-75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce delay-150"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce delay-300"></span>
         </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = data.userStat || {};
  const history = data.testResults || [];
  const mistakes = data.mistakes || [];

  // Math helper for total practice time formatting
  const formatTime = (sec: number) => {
    if (!sec) return '0m';
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // SVG Chart builder helper
  const renderProgressionSvg = () => {
    if (history.length === 0) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic">
          No tests found. Take a test on the practice page first!
        </div>
      );
    }

    const dataPoints = [...history].slice(0, 15).reverse();
    const maxVal = Math.max(...dataPoints.map((d: any) => d.wpm), stats.bestWpm || 80);
    const minVal = 0;

    const width = 500;
    const height = 180;
    const padding = 15;

    const points = dataPoints.map((d: any, index: number) => {
      const x = padding + (index / Math.max(dataPoints.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((d.wpm - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return { x, y, wpm: d.wpm, acc: d.accuracy };
    });

    let pathD = '';
    let areaD = '';

    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      areaD = `M ${points[0].x} ${height - padding} L ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`;
        areaD += ` L ${points[i].x} ${points[i].y}`;
      }
      areaD += ` L ${points[points.length - 1].x} ${height - padding} Z`;
    }

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((val, i) => {
          const y = padding + val * (height - 2 * padding);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Gradient fill */}
        {areaD && <path d={areaD} fill="url(#curveGradient)" />}

        {/* Line path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Nodes */}
        {points.map((pt, i) => (
          <g key={i} className="group">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              className="fill-background stroke-primary"
              strokeWidth="2.5"
            />
            {/* Tooltip trigger area */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="12"
              className="fill-transparent cursor-pointer"
            />
          </g>
        ))}
      </svg>
    );
  };

  // Convert AI suggested lesson IDs into metadata objects
  const suggestedLessons: Lesson[] = (aiAnalysis?.lessons || [])
    .map((lid: number) => LESSONS.find((l) => l.id === lid))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-background font-mono text-on-surface p-4 sm:p-6 lg:p-12 pt-24 max-w-6xl mx-auto selection:bg-primary/20">
      
      {/* ── Profile Header ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 mb-12 px-2">
         <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface-container-low border border-white/5 flex items-center justify-center text-primary relative overflow-hidden shadow-xl shrink-0">
            <UserIcon className="w-12 h-12 sm:w-14 sm:h-14 relative z-10" />
            <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
         </div>
         <div className="flex-grow space-y-2 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black font-['Manrope'] tracking-tight text-on-surface uppercase">{data.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-on-surface-variant/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Joined {new Date(data.createdAt).toLocaleDateString()}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block"></span>
               <span className="flex items-center gap-1.5 text-primary">
                 <Trophy className="w-3.5 h-3.5" /> 
                 {stats.bestWpm >= 80 ? 'Legendary Typist' : stats.bestWpm >= 50 ? 'Pro Typist' : 'Novice Typist'}
               </span>
            </div>
         </div>
      </div>

      {/* ── Stats Bento Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
         {[
           { label: 'best wpm', value: stats.bestWpm, icon: <Trophy className="w-4 h-4" />, color: 'text-primary' },
           { label: 'avg wpm', value: Math.round(stats.avgWpm), icon: <Activity className="w-4 h-4" />, color: 'text-on-surface' },
           { label: 'accuracy', value: `${Math.round(stats.avgAccuracy)}%`, icon: <Target className="w-4 h-4" />, color: 'text-correct' },
           { label: 'time spent', value: formatTime(stats.totalTimeSpent), icon: <Clock className="w-4 h-4" />, color: 'text-on-surface-variant' },
         ].map((stat, i) => (
           <div key={i} className="bg-surface-container-low border border-white/5 p-4 sm:p-6 rounded-2xl shadow-md group hover:border-primary/25 transition-all duration-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                 <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-on-surface-variant/40">{stat.label}</span>
                 <div className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-black ${stat.color}`}>{stat.value}</div>
           </div>
         ))}
      </div>

      {/* ── AI Diagnostic insights block ── */}
      <div className="mb-12">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Brain className="w-48 h-48" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Performance Diagnostics
              </h2>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                AI Coach analysis of keystrokes &amp; custom improvement suggestions
              </p>
            </div>

            <button
              onClick={handleAIAnalysis}
              disabled={analyzing}
              className={`px-5 py-3 rounded-md text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                analyzing 
                  ? 'bg-primary/10 text-primary cursor-not-allowed border border-primary/20' 
                  : 'bg-primary text-background hover:bg-primary/95 hover:scale-[1.02]'
              }`}
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {diagnosticStep}
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>

          {analyzing ? (
            <div className="border border-white/5 bg-black/25 rounded-xl p-8 flex flex-col items-center justify-center min-h-[220px] text-center gap-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
              </div>
              <p className="text-xs uppercase font-bold text-primary tracking-widest animate-pulse mt-4">
                {diagnosticStep}
              </p>
              <span className="text-[9px] text-on-surface-variant/35 tracking-wider">
                This takes about 5 seconds to analyze keystrokes distribution...
              </span>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-6">
              {/* Summary message */}
              <div className="border-l-2 border-primary pl-4 py-1 text-xs sm:text-sm font-sans font-medium text-on-surface-variant/90 leading-relaxed italic">
                &ldquo;{aiAnalysis.summary}&rdquo;
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths Card */}
                <div className="bg-black/10 border border-white/5 rounded-xl p-4 sm:p-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-correct mb-3 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Key Strengths
                  </h4>
                  <ul className="space-y-2 text-[11px] text-on-surface-variant/75 leading-relaxed font-sans list-disc pl-4">
                    {(aiAnalysis.strengths || []).map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-black/10 border border-white/5 rounded-xl p-4 sm:p-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-error mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Core Weaknesses
                  </h4>
                  <ul className="space-y-2 text-[11px] text-on-surface-variant/75 leading-relaxed font-sans list-disc pl-4">
                    {(aiAnalysis.weaknesses || []).map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Tips */}
              <div className="bg-black/10 border border-white/5 rounded-xl p-4 sm:p-5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Training Tips &amp; Hacks
                </h4>
                <ul className="space-y-2 text-[11px] text-on-surface-variant/75 leading-relaxed font-sans list-decimal pl-4">
                  {(aiAnalysis.tips || []).map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Suggested Practice Lessons */}
              {suggestedLessons.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Recommended Lessons for Practice
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {suggestedLessons.map((lesson) => {
                      const diffColor = getDifficultyColor(lesson.difficulty);
                      return (
                        <Link 
                          key={lesson.id} 
                          href={`/learn?lesson=${lesson.id}`}
                          className="bg-black/20 border border-white/5 hover:border-primary/30 rounded-xl p-4 flex flex-col justify-between hover:bg-primary/[0.02] transition-all group cursor-pointer"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-primary">LEVEL {lesson.level}</span>
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${diffColor}15`, color: diffColor }}>
                                {lesson.difficulty}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-on-surface uppercase group-hover:text-primary transition-colors line-clamp-1">{lesson.title}</div>
                              <div className="text-[9px] font-bold text-on-surface-variant/35 uppercase tracking-wide line-clamp-1 mt-0.5">{lesson.subtitle}</div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-on-surface-variant/40 uppercase group-hover:text-primary transition-colors">
                            <span>Keys: {lesson.keys.join(', ')}</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
              <Brain className="w-8 h-8 text-on-surface-variant/20" />
              <p className="text-xs uppercase font-bold text-on-surface-variant/30 tracking-widest">
                No diagnostic analysis report yet.
              </p>
              <button
                onClick={handleAIAnalysis}
                className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Click here to diagnose typing pattern
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Data Breakdown Sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* WPM Trend & progression */}
         <div className="lg:col-span-2 space-y-8">
            <section>
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Speed Progression (Last 15 Tests)
               </h3>
               <div className="w-full relative h-64 bg-surface-container-low border border-white/5 rounded-2xl shadow-lg flex items-end overflow-hidden">
                 {renderProgressionSvg()}
               </div>
            </section>

            {/* History Table */}
            <section>
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  <History className="w-4 h-4" />
                  Recent Practice Activity
               </h3>
               <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-xl overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[450px] sm:min-w-0">
                     <thead>
                        <tr className="bg-surface-container-highest/30 text-[9px] uppercase font-black tracking-widest text-on-surface-variant/40">
                           <th className="px-6 py-4">WPM</th>
                           <th className="px-6 py-4">Accuracy</th>
                           <th className="px-6 py-4">Mode</th>
                           <th className="px-6 py-4">Errors</th>
                           <th className="px-6 py-4 text-right">Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {history.length > 0 ? history.slice(0, 12).map((h: any) => (
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
                              <td className="px-6 py-4">
                                 <span className="text-xs font-bold text-error">{h.mistakes}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className="text-[10px] font-medium text-on-surface-variant/30">{new Date(h.createdAt).toLocaleDateString()}</span>
                              </td>
                           </tr>
                        )) : (
                           <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic">No tests found</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </section>
         </div>

         {/* Sidebar: Key Diagnostic Breakdown */}
         <div className="space-y-8">
            <section>
               <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  <AlertTriangle className="w-4 h-4 text-error" />
                  Key Mistake Heatmap
               </h3>
               <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                  {mistakes.length > 0 ? mistakes.map((m: any) => {
                    const fingerName = KEY_FINGER_MAP[m.keyPressed.toLowerCase()] || 'unknown';
                    const fingerDisplay = FINGER_DISPLAY_NAMES[fingerName] || 'Other';
                    return (
                      <div key={m.keyPressed} className="space-y-1.5">
                         <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-on-surface">Key: <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-white/10">{m.keyPressed}</kbd> <span className="text-[9px] text-on-surface-variant/30 uppercase ml-1">({fingerDisplay})</span></span>
                            <span className="text-error">{m.count} miss</span>
                         </div>
                         <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div 
                             className="h-full bg-error transition-all duration-1000" 
                             style={{ width: `${(m.count / (mistakes[0].count || 1)) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                    );
                  }) : (
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/20 italic py-10 text-center">Perfect form. No weak keys found.</p>
                  )}
               </div>
            </section>

            <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl text-center relative overflow-hidden">
               <h3 className="text-xs font-black uppercase underline decoration-primary/40 underline-offset-4 tracking-widest mb-4">Mastery Rank</h3>
               <div className="flex items-center justify-center p-4">
                  <div className="p-4 bg-primary/20 rounded-full border border-primary/20 shadow-[0_0_30px_rgba(234,179,8,0.25)]">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
               </div>
               <p className="text-[11px] font-sans font-medium text-on-surface-variant/80 mt-2">
                  You are typing faster than <span className="text-primary font-black">{stats.bestWpm > 0 ? Math.min(stats.bestWpm + 22, 98) : 0}%</span> of other global typists.
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
