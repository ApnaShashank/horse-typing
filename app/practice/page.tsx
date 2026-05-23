'use client';

import { useState, useRef, useEffect, useLayoutEffect, useMemo, memo } from 'react';
import { useTypingEngine } from './useTypingEngine';
import { GenerationOptions } from './words';
import {
  Clock, Type, Quote, Mountain, Wrench, X, Play, RotateCcw,
  Settings2, BarChart3, RefreshCw, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Memoized Word Component ─────────────────────────────────────
const Word = memo(({ target, typed, isCurrent, input }: {
  target: string;
  typed?: string;
  isCurrent: boolean;
  input: string;
}) => {
  return (
    <span className={`${isCurrent ? 'active-word' : ''} mx-[0.25em] my-[0.3em] inline-block relative font-mono transition-none select-none`}>
      {target.split('').map((char, i) => {
        const typedChar = isCurrent ? input[i] : (typed ? typed[i] : undefined);
        let cls = 'text-on-surface-variant/25';
        if (typedChar !== undefined) {
          cls = typedChar === char ? 'text-correct' : 'text-error bg-error/10 rounded-[2px]';
        }
        return <span key={i} className={`char ${cls}`}>{char}</span>;
      })}

      {/* Extra characters beyond word length */}
      {isCurrent && input.length > target.length && input.slice(target.length).split('').map((char, i) => (
        <span key={`extra-cur-${i}`} className="char text-error bg-error/20 rounded-[2px]">{char}</span>
      ))}
      {!isCurrent && typed && typed.length > target.length && typed.slice(target.length).split('').map((char, i) => (
        <span key={`extra-hist-${i}`} className="char text-error/50 bg-error/5 rounded-[2px]">{char}</span>
      ))}
    </span>
  );
});
Word.displayName = 'Word';

// ─── Live Stat Pill ──────────────────────────────────────────────
function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[22px] sm:text-3xl font-black leading-none ${accent ?? 'text-on-surface'}`}>{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-on-surface-variant/30">{label}</span>
    </div>
  );
}

// ─── Result Stat Card ────────────────────────────────────────────
function ResultCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid-box p-4 md:p-5 bg-white/[0.015] flex flex-col gap-1 text-center sm:text-left"
    >
      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] text-on-surface-variant/30 truncate">{label}</span>
      <span className={`text-2xl sm:text-3xl font-black leading-none ${color ?? 'text-on-surface'}`}>{value}</span>
      {sub && <span className="text-[9px] font-bold text-on-surface-variant/25 uppercase tracking-wide truncate">{sub}</span>}
    </motion.div>
  );
}

// ─── Main Practice Page ──────────────────────────────────────────
export default function Practice() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [customText, setCustomText] = useState('');
  const [customShuffle, setCustomShuffle] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.authenticated) setUser(d.user);
    }).catch(() => {});
  }, []);

  const handleTestFinish = async (stats: any) => {
    if (!user) return;
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: stats.mode,
          duration: stats.duration,
          wordCount: stats.wordCount,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          mistakes: stats.incorrectChars + stats.extraChars + stats.missedChars,
          rawSpeed: stats.raw,
          weakKeys: stats.weakKeys,
        }),
      });
    } catch (e) { console.error('Error saving result:', e); }
  };

  const {
    status, words, typedHistory, currentWordInput, activeWordIndex,
    timeRemaining, timeElapsed, wpm, raw, accuracy,
    correctChars, incorrectChars, extraChars, missedChars, consistency,
    options, wpmHistory, quoteSource, handleTyping, initializeEngine,
  } = useTypingEngine({
    mode: 'time',
    language: 'english',
    punctuation: false,
    numbers: false,
    wordCount: 30,
    quoteLength: 'all',
  }, handleTestFinish);

  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const [isWordJump, setIsWordJump] = useState(false);
  const [lineOffset, setLineOffset] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const prevWordIndex = useRef(0);

  // Caret tracking
  useLayoutEffect(() => {
    if (status === 'finished') return;
    const container = wordsContainerRef.current;
    if (!container) return;
    const activeSpan = container.querySelector('.active-word') as HTMLElement;
    if (!activeSpan) return;

    const charSpans = activeSpan.querySelectorAll('.char');
    const currentCharSpan = charSpans[currentWordInput.length] as HTMLElement;
    let x = activeSpan.offsetLeft;
    const y = activeSpan.offsetTop + 6;

    if (currentWordInput.length > 0) {
      if (currentCharSpan) {
        x += currentCharSpan.offsetLeft;
      } else {
        const lastChar = charSpans[charSpans.length - 1] as HTMLElement;
        if (lastChar) x += lastChar.offsetLeft + lastChar.offsetWidth;
      }
    }

    const jumped = prevWordIndex.current !== activeWordIndex;
    setIsWordJump(jumped);
    prevWordIndex.current = activeWordIndex;
    setCaretPos({ x, y });

    const lineHeight = 48;
    if (activeSpan.offsetTop > lineHeight * 2.5) {
      setLineOffset(activeSpan.offsetTop - lineHeight * 2);
    } else {
      setLineOffset(0);
    }
  }, [currentWordInput, activeWordIndex, status, words]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(p => !p);
      if (e.key === 'Tab') { e.preventDefault(); initializeEngine(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [initializeEngine]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Mode sub-options
  const handleModeChange = (mode: GenerationOptions['mode']) => {
    const newOpts: GenerationOptions = { ...options, mode };
    if (mode === 'time') newOpts.wordCount = 30;
    else if (mode === 'words') newOpts.wordCount = 25;
    else if (mode === 'quote') newOpts.quoteLength = 'all';
    initializeEngine(newOpts);
  };

  const startCustomMode = () => {
    initializeEngine({ ...options, mode: 'custom', customText, delimiter: 'space', shuffle: customShuffle });
    setIsSidebarOpen(false);
  };

  const timeDurations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

  // Graph path calculation
  const graphData = useMemo(() => {
    if (!wpmHistory?.length) return { wpm: '', raw: '', wpmArea: '', errorDots: [], wpmPoints: [], rawPoints: [] };
    const maxVal = Math.max(...wpmHistory.map(h => Math.max(h.wpm, h.raw, 40)));
    const W = 1000, H = 160;
    const sx = W / Math.max(wpmHistory.length - 1, 1);
    const sy = H / maxVal;

    const wpmPoints = wpmHistory.map((h, i) => [i * sx, H - h.wpm * sy]);
    const rawPoints = wpmHistory.map((h, i) => [i * sx, H - h.raw * sy]);

    // Helper for line properties (length and angle)
    const lineProps = (pointA: number[], pointB: number[]) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      };
    };

    // Calculate control point for bezier curve
    const controlPoint = (current: number[], previous: number[] | undefined, next: number[] | undefined, reverse: boolean) => {
      const p = previous || current;
      const n = next || current;
      const o = lineProps(p, n);
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * 0.15; // smoothing factor
      const x = current[0] + Math.cos(angle) * length;
      const y = current[1] + Math.sin(angle) * length;
      return [x, y];
    };

    // Form bezier curve command
    const bezierCommand = (point: number[], i: number, a: number[][]) => {
      const cps = controlPoint(a[i - 1], a[i - 2], point, false);
      const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
      return `C ${cps[0].toFixed(1)},${cps[1].toFixed(1)} ${cpe[0].toFixed(1)},${cpe[1].toFixed(1)} ${point[0].toFixed(1)},${point[1].toFixed(1)}`;
    };

    const svgPath = (pts: number[][]) => {
      if (pts.length === 0) return '';
      return pts.reduce((acc, point, i, a) => i === 0
        ? `M ${point[0].toFixed(1)},${point[1].toFixed(1)}`
        : `${acc} ${bezierCommand(point, i, a)}`
      , '');
    };

    const wpmPath = svgPath(wpmPoints);
    const rawPath = svgPath(rawPoints);
    
    // Close the area path down to the bottom (Y=160)
    const lastWpmPoint = wpmPoints[wpmPoints.length - 1];
    const wpmArea = wpmPath ? `${wpmPath} L ${lastWpmPoint[0].toFixed(1)},160 L 0,160 Z` : '';

    return {
      wpm: wpmPath,
      raw: rawPath,
      wpmArea,
      wpmPoints,
      rawPoints,
      errorDots: wpmHistory
        .map((h, i) => ({ x: i * sx, y: H - h.wpm * sy, count: h.errors }))
        .filter(e => e.count > 0),
    };
  }, [wpmHistory]);


  // ── FINISHED SCREEN ─────────────────────────────────────────────
  if (status === 'finished') {
    const maxVal = wpmHistory.length > 0 ? Math.max(...wpmHistory.map(h => Math.max(h.wpm, h.raw, 40))) : 100;
    
    return (
      <div className="min-h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] mt-14 flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto md:overflow-hidden font-mono text-on-surface select-none">
        <div className="w-full max-w-5xl md:h-full flex flex-col justify-center py-4 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            
            {/* Left side: WPM Hero + Stats Grid */}
            <div className="md:col-span-5 flex flex-col gap-3">
              {/* WPM Hero */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid-box p-6 bg-white/[0.01] relative overflow-hidden flex flex-col items-center justify-center shrink-0"
              >
                <div className="absolute inset-0 opacity-[0.02] grid-lines-hero" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 mb-1">Words Per Minute</div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
                  className="text-7xl sm:text-8xl font-black leading-none text-primary tracking-tighter"
                >
                  {wpm}
                </motion.div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid grid-cols-3 gap-2.5"
              >
                <ResultCard label="Accuracy" value={`${accuracy}%`} color="text-correct" />
                <ResultCard label="Raw WPM" value={raw} color="text-on-surface-variant/60" />
                <ResultCard label="Consistency" value={`${consistency}%`} color="text-amber-400/70" />
                <ResultCard label="Correct" value={correctChars} color="text-correct/75" />
                <ResultCard label="Errors" value={incorrectChars + extraChars + missedChars} color={incorrectChars + extraChars + missedChars > 0 ? "text-error" : "text-on-surface-variant/40"} />
                <ResultCard label="Mode" value={options.mode.toUpperCase()} color="text-primary/70" />
              </motion.div>
            </div>

            {/* Right side: Graph + Action Buttons */}
            <div className="md:col-span-7 flex flex-col justify-between gap-3">
              {/* Graph Card */}
              {wpmHistory.length > 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="grid-box p-5 bg-white/[0.01] flex-1 flex flex-col min-h-[220px]"
                >
                  <div className="flex items-center gap-3 mb-4 shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.45em] text-on-surface-variant/40">Performance Graph</span>
                    {quoteSource && (
                      <span className="ml-auto text-[9px] text-primary/30 font-bold uppercase tracking-wide truncate max-w-[200px]">— {quoteSource}</span>
                    )}
                  </div>
                  
                  {/* Graph Canvas */}
                  <div className="flex-1 flex gap-4 min-h-0 relative items-stretch py-2">
                    {/* Y Axis labels */}
                    <div className="flex flex-col justify-between text-[8px] font-bold text-on-surface-variant/20 uppercase w-5 text-right shrink-0">
                      <span>{maxVal}</span>
                      <span>{Math.round(maxVal / 2)}</span>
                      <span>0</span>
                    </div>
                    
                    {/* SVG container */}
                    <div className="flex-1 relative min-h-0">
                      <svg className="w-full h-full" viewBox="0 0 1000 160" preserveAspectRatio="none">
                        <defs>
                          {/* Glow filter for WPM line */}
                          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          {/* Smooth gradient area below WPM line */}
                          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.16} />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.00} />
                          </linearGradient>
                        </defs>

                        {/* Horizontal background gridlines */}
                        <line x1="0" y1="0" x2="1000" y2="0" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                        <line x1="0" y1="40" x2="1000" y2="40" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 4" strokeWidth="1" />
                        <line x1="0" y1="80" x2="1000" y2="80" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 4" strokeWidth="1" />
                        <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 4" strokeWidth="1" />
                        <line x1="0" y1="160" x2="1000" y2="160" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />

                        {/* Vertical background gridlines */}
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const x = (idx + 1) * 166.6;
                          return (
                            <line key={idx} x1={x} y1="0" x2={x} y2="160" stroke="rgba(255,255,255,0.015)" strokeDasharray="2 6" strokeWidth="1" />
                          );
                        })}

                        {/* Raw line - subtle dashed line in background */}
                        <motion.path
                          d={graphData.raw}
                          fill="none"
                          stroke="rgba(255,255,255,0.12)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                        />
                        
                        {/* WPM area filled */}
                        <motion.path
                          d={graphData.wpmArea}
                          fill="url(#area-grad)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        
                        {/* WPM line - glowing neon line */}
                        <motion.path
                          d={graphData.wpm}
                          fill="none"
                          stroke="var(--color-primary)"
                          strokeWidth="2.5"
                          filter="url(#neon-glow)"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        
                        {/* Error dots */}
                        {graphData.errorDots.map((e, i) => (
                          <circle key={i} cx={e.x} cy={e.y} r="3.5" fill="var(--color-error)" opacity="0.85" />
                        ))}

                        {/* Vertical hover line indicator */}
                        {hoveredIndex !== null && graphData.wpmPoints[hoveredIndex] && (
                          <line
                            x1={graphData.wpmPoints[hoveredIndex][0]}
                            y1={0}
                            x2={graphData.wpmPoints[hoveredIndex][0]}
                            y2={160}
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeDasharray="3 3"
                            strokeWidth="1.5"
                            pointerEvents="none"
                          />
                        )}

                        {/* Hover active dots */}
                        {hoveredIndex !== null && graphData.wpmPoints[hoveredIndex] && graphData.rawPoints[hoveredIndex] && (
                          <>
                            {/* WPM dot */}
                            <circle
                              cx={graphData.wpmPoints[hoveredIndex][0]}
                              cy={graphData.wpmPoints[hoveredIndex][1]}
                              r="5"
                              fill="var(--color-primary)"
                              stroke="#111111"
                              strokeWidth="2"
                              pointerEvents="none"
                            />
                            {/* Raw dot */}
                            <circle
                              cx={graphData.rawPoints[hoveredIndex][0]}
                              cy={graphData.rawPoints[hoveredIndex][1]}
                              r="4"
                              fill="rgba(255, 255, 255, 0.4)"
                              stroke="#111111"
                              strokeWidth="1.5"
                              pointerEvents="none"
                            />
                          </>
                        )}

                        {/* Interactive hover zones */}
                        {wpmHistory.map((h, i) => {
                          const sliceWidth = 1000 / wpmHistory.length;
                          const x = i * (1000 / Math.max(wpmHistory.length - 1, 1));
                          const rectWidth = i === 0 || i === wpmHistory.length - 1 ? sliceWidth / 2 : sliceWidth;
                          const rectX = i === 0 ? 0 : x - sliceWidth / 2;

                          return (
                            <rect
                              key={i}
                              x={rectX}
                              y={0}
                              width={rectWidth}
                              height={160}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIndex(i)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Hover Tooltip Box */}
                      {hoveredIndex !== null && wpmHistory[hoveredIndex] && graphData.wpmPoints[hoveredIndex] && (
                        <div
                          className="absolute z-30 pointer-events-none bg-[#161616]/95 border border-white/10 p-2.5 rounded-[2px] text-[10px] flex flex-col gap-1 shadow-2xl font-mono"
                          style={{
                            left: `${(graphData.wpmPoints[hoveredIndex][0] / 1000) * 100}%`,
                            top: '12px',
                            transform: hoveredIndex === 0 
                              ? 'translateX(12px)' 
                              : hoveredIndex === wpmHistory.length - 1 
                                ? 'translateX(-100%) translateX(-12px)' 
                                : 'translateX(-50%)',
                          }}
                        >
                          <div className="text-on-surface-variant/40 font-bold uppercase tracking-wider">Second {wpmHistory[hoveredIndex].time}</div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-on-surface">WPM: <strong className="text-primary font-black">{wpmHistory[hoveredIndex].wpm}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="text-on-surface-variant/70">Raw: <strong className="font-bold">{wpmHistory[hoveredIndex].raw}</strong></span>
                          </div>
                          {wpmHistory[hoveredIndex].errors > 0 && (
                            <div className="flex items-center gap-2 text-error">
                              <span className="w-1.5 h-1.5 rounded-full bg-error" />
                              <span>Errors: <strong className="font-bold">{wpmHistory[hoveredIndex].errors}</strong></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Graph Footer Legend */}
                  <div className="flex justify-between mt-3 text-[8px] font-bold text-on-surface-variant/20 uppercase tracking-widest shrink-0">
                    <span>Start</span>
                    <div className="flex items-center gap-5">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-primary/60" /> WPM</span>
                      <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-px bg-white/20 border-t border-dashed" /> Raw</span>
                      <span className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-error/70" /> Errors</span>
                    </div>
                    <span>{timeElapsed}s</span>
                  </div>
                </motion.div>
              ) : (
                <div className="grid-box p-6 bg-white/[0.01] flex-1 flex items-center justify-center min-h-[220px]">
                  <span className="text-xs text-on-surface-variant/30 uppercase tracking-wider">No graph data available</span>
                </div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="flex gap-2.5 shrink-0"
              >
                <button
                  onClick={() => initializeEngine(options)}
                  className="flex-1 grid-box py-3.5 flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-[0.35em] text-primary border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Same
                </button>
                <button
                  onClick={() => initializeEngine()}
                  className="flex-1 grid-box py-3.5 flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.35em] text-on-surface-variant/50 hover:text-on-surface hover:border-white/15 hover:bg-white/4 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> New Test
                </button>
                {user && (
                  <Link
                    href="/profile"
                    className="flex-1 grid-box py-3.5 flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 hover:text-on-surface-variant hover:border-white/15 hover:bg-white/4 transition-all"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> My Stats
                  </Link>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── TYPING / IDLE SCREEN ─────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col font-mono text-on-surface overflow-hidden relative selection:bg-primary/10">

      {/* ── Custom Mode Sidebar ─────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:bg-transparent md:pointer-events-none"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full sm:w-80 bg-surface-container-low border-l border-white/5 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">Custom Mode</p>
                  <h2 className="text-sm font-black uppercase text-on-surface tracking-wide mt-0.5">Text Configuration</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="grid-box p-2 hover:bg-white/5 transition-colors text-on-surface-variant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Input Text
                  </label>
                  <textarea
                    className="w-full h-48 bg-black/30 border border-white/5 rounded-[2px] p-4 text-xs text-on-surface focus:border-primary/30 outline-none transition-colors resize-none font-mono leading-relaxed placeholder-on-surface-variant/20"
                    placeholder="Paste your custom text here…"
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Shuffle Words
                  </label>
                  <button
                    onClick={() => setCustomShuffle(!customShuffle)}
                    className={`w-full py-3 rounded-[2px] text-[11px] font-black uppercase tracking-widest transition-all border ${customShuffle
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'border-white/5 text-on-surface-variant/30 hover:border-white/10'}`}
                  >
                    {customShuffle ? '✓ Shuffle On' : 'Shuffle Off'}
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex-shrink-0">
                <button
                  onClick={startCustomMode}
                  disabled={!customText.trim()}
                  className="w-full grid-box py-4 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-primary border-primary/40 bg-primary/8 hover:bg-primary/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Custom Test
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Top Control Bar ─────────────────────────────────────── */}
      <div className="w-full border-b border-white/5 bg-background/60 backdrop-blur-md z-30 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Mode + Sub-options */}
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-on-surface-variant/35 overflow-x-auto no-scrollbar flex-1">
            {/* Mode toggles */}
            <div className="flex items-center gap-1 shrink-0">
              {[
                { id: 'time', icon: <Clock className="w-3.5 h-3.5" />, label: 'Time' },
                { id: 'words', icon: <Type className="w-3.5 h-3.5" />, label: 'Words' },
                { id: 'quote', icon: <Quote className="w-3.5 h-3.5" />, label: 'Quote' },
                { id: 'zen', icon: <Mountain className="w-3.5 h-3.5" />, label: 'Zen' },
                { id: 'custom', icon: <Wrench className="w-3.5 h-3.5" />, label: 'Custom' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    handleModeChange(m.id as any);
                    if (m.id === 'custom') setIsSidebarOpen(true);
                  }}
                  className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-[2px] transition-all whitespace-nowrap ${options.mode === m.id
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-on-surface hover:bg-white/5'}`}
                >
                  {m.icon}
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/8 mx-1 shrink-0" />

            {/* Sub-option toggles */}
            <div className="flex items-center gap-1 shrink-0">
              {options.mode === 'time' && timeDurations.map(v => (
                <button
                  key={v}
                  onClick={() => initializeEngine({ ...options, wordCount: v })}
                  className={`px-2 sm:px-3 py-1.5 rounded-[2px] transition-all ${options.wordCount === v
                    ? 'text-primary font-black bg-primary/8'
                    : 'hover:text-on-surface hover:bg-white/5'}`}
                >
                  {v}s
                </button>
              ))}
              {options.mode === 'words' && wordCounts.map(v => (
                <button
                  key={v}
                  onClick={() => initializeEngine({ ...options, wordCount: v })}
                  className={`px-2 sm:px-3 py-1.5 rounded-[2px] transition-all ${options.wordCount === v
                    ? 'text-primary font-black bg-primary/8'
                    : 'hover:text-on-surface hover:bg-white/5'}`}
                >
                  {v}
                </button>
              ))}
              {options.mode === 'quote' && (['all', 'short', 'medium', 'long'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => initializeEngine({ ...options, quoteLength: v })}
                  className={`px-2 sm:px-3 py-1.5 rounded-[2px] transition-all capitalize ${options.quoteLength === v
                    ? 'text-primary font-black bg-primary/8'
                    : 'hover:text-on-surface hover:bg-white/5'}`}
                >
                  {v}
                </button>
              ))}
              {options.mode === 'custom' && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-primary bg-primary/8 hover:bg-primary/15 transition-all"
                >
                  <Settings2 className="w-3.5 h-3.5" /> Config
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/8 mx-1 shrink-0" />

            {/* Punc / Numbers toggles */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => initializeEngine({ ...options, punctuation: !options.punctuation })}
                className={`px-2 sm:px-3 py-1.5 rounded-[2px] transition-all ${options.punctuation
                  ? 'text-primary font-black bg-primary/8'
                  : 'hover:text-on-surface hover:bg-white/5'}`}
              >
                @
              </button>
              <button
                onClick={() => initializeEngine({ ...options, numbers: !options.numbers })}
                className={`px-2 sm:px-3 py-1.5 rounded-[2px] transition-all ${options.numbers
                  ? 'text-primary font-black bg-primary/8'
                  : 'hover:text-on-surface hover:bg-white/5'}`}
              >
                #
              </button>
            </div>
          </div>

          {/* Timer display (right side) */}
          {status === 'running' && (
            <div className="text-right shrink-0">
              {options.mode === 'time' ? (
                <span className={`text-base font-black tabular-nums ${timeRemaining <= 5 ? 'text-error animate-pulse' : 'text-primary/60'}`}>
                  {timeRemaining}s
                </span>
              ) : (
                <span className="text-base font-black tabular-nums text-on-surface-variant/30">{timeElapsed}s</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 relative z-10"
        onClick={() => { hiddenInputRef.current?.focus(); setIsFocused(true); }}
      >
        <div className="w-full max-w-4xl flex flex-col gap-6">

          {/* Live stats bar (visible when running) */}
          <AnimatePresence>
            {status === 'running' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-center gap-8 sm:gap-12"
              >
                <StatPill label="WPM" value={wpm || '—'} accent="text-primary" />
                <div className="w-px h-8 bg-white/5" />
                <StatPill label="Accuracy" value={wpm > 0 ? `${accuracy}%` : '—'} accent="text-correct" />
                <div className="w-px h-8 bg-white/5" />
                <StatPill label="Errors" value={incorrectChars + extraChars + missedChars} accent="text-error/70" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quote source */}
          {options.mode === 'quote' && quoteSource && (
            <div className="text-center">
              <span className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em]">— {quoteSource}</span>
            </div>
          )}

          {/* ── Text Display Area ── */}
          {status === 'loading' ? (
            <div className="flex items-center justify-center h-[160px]">
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    className="w-[3px] h-5 bg-primary/50 rounded-full"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`relative w-full cursor-text transition-all`}
              tabIndex={0}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {/* Hidden Input */}
              <input
                ref={hiddenInputRef}
                type="text"
                className="absolute opacity-0 -z-10 w-1 h-1 pointer-events-none"
                value={currentWordInput}
                onChange={e => handleTyping(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {/* Words container */}
              <div className="relative w-full overflow-hidden h-[168px]">
                <div
                  ref={wordsContainerRef}
                  className={`absolute top-0 left-0 w-full text-[26px] sm:text-[30px] md:text-[34px] flex flex-wrap content-start select-none transition-all duration-300 ${!isFocused ? 'opacity-[0.06] blur-[3px]' : ''}`}
                  style={{ transform: `translateY(-${lineOffset}px)` }}
                >
                  {/* Caret */}
                  {isFocused && (
                    <div
                      className={`caret ${status === 'running' ? '' : 'caret-blink'} ${isWordJump ? 'caret-instant' : ''}`}
                      style={{
                        height: '36px',
                        transform: `translate(${caretPos.x}px, ${caretPos.y}px)`,
                        transition: isWordJump ? 'none' : 'transform 0.1s cubic-bezier(0.19, 1, 0.22, 1)',
                      }}
                    />
                  )}
                  {words.map((word, i) => (
                    <Word
                      key={i}
                      target={word}
                      typed={typedHistory[i]}
                      isCurrent={i === activeWordIndex}
                      input={currentWordInput}
                    />
                  ))}
                </div>

                {/* Focus overlay */}
                {!isFocused && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary/50 uppercase tracking-[0.5em]">
                      <div className="w-10 h-px bg-primary/20" />
                      Click to Focus
                      <div className="w-10 h-px bg-primary/20" />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {(status === 'running' || status === 'idle') && options.mode !== 'time' && options.mode !== 'zen' && (
                <div className="mt-4 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary/40 rounded-full"
                    animate={{ width: `${words.length > 0 ? (activeWordIndex / words.length) * 100 : 0}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Footer hints ── */}
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.35em] text-on-surface-variant/15 flex-shrink-0 select-none">
            <div className="flex gap-6">
              <span>Tab — Restart</span>
              <span className="hidden sm:inline">Esc — Config</span>
            </div>
            <div className="flex items-center gap-3">
              {status === 'idle' && (
                <span className="animate-pulse text-primary/40">Start typing…</span>
              )}
              {status === 'running' && options.mode !== 'time' && (
                <span className="tabular-nums text-on-surface-variant/25">
                  {activeWordIndex} / {words.length}
                </span>
              )}
              <button
                onClick={e => { e.stopPropagation(); initializeEngine(options); hiddenInputRef.current?.focus(); }}
                className="p-2 hover:text-on-surface-variant/40 hover:bg-white/5 rounded-[2px] transition-all"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .char { transition: color 0.08s ease-out, background 0.08s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
