'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, Activity, Cpu, Layout, Target, Layers, 
  ChevronRight, ArrowRight, MousePointer2, Type, 
  Terminal, ShieldCheck, Gauge, Database, DatabaseBackup, BarChart3, RotateCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Full Keyboard Layout ───────────────────────────────────────
const KB_ROWS: string[][] = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
];

function VirtualKey({ label, active, wide, extraWide }: {
  label: string; active: boolean; wide?: boolean; extraWide?: boolean;
}) {
  return (
    <motion.div
      animate={active
        ? { scale: 0.88, backgroundColor: 'var(--color-primary)' }
        : { scale: 1, backgroundColor: 'rgba(255,255,255,0.02)' }
      }
      transition={{ duration: 0.08 }}
      className={`
        relative flex items-center justify-center rounded-sm border font-bold select-none
        text-[9px] uppercase tracking-wide h-7
        ${extraWide ? 'min-w-[50px]' : wide ? 'min-w-[34px]' : 'min-w-[24px]'}
        px-1
        ${active
          ? 'border-primary text-background shadow-md shadow-primary/25'
          : 'border-white/8 text-on-surface-variant/25'
        }
      `}
    >
      {label}
    </motion.div>
  );
}

// ─── Main Hero Demo (typing + keyboard synced) ──────────────────
function HeroDemo() {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0);
  const [activeKey, setActiveKey] = useState<string>('');

  const fullText = 'the quick brown fox jumps over the lazy dog and the swift coder never lets a single keystroke go to waste in the pursuit of mastery and speed is the art of precision under pressure every character counts and every second sharpens the blade';
  const typoText  = 'the quick borwn fox';

  function flashKey(key: string) {
    setActiveKey(key);
    setTimeout(() => setActiveKey(''), 100);
  }

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (phase === 0) {
      if (text.length < typoText.length) {
        t = setTimeout(() => {
          const ch = typoText[text.length];
          flashKey(ch === ' ' ? 'space' : ch);
          setText(typoText.slice(0, text.length + 1));
        }, 170);
      } else {
        t = setTimeout(() => setPhase(1), 1200);
      }
    } else if (phase === 1) {
      if (text.length > 10) {
        t = setTimeout(() => {
          flashKey('⌫');
          setText(prev => prev.slice(0, -1));
        }, 120);
      } else {
        setPhase(2);
      }
    } else if (phase === 2) {
      if (text.length < fullText.length) {
        t = setTimeout(() => {
          const ch = fullText[text.length];
          flashKey(ch === ' ' ? 'space' : ch);
          setText(fullText.slice(0, text.length + 1));
        }, 130);
      } else {
        t = setTimeout(() => { setPhase(0); setText(''); }, 5000);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase]);

  const isInTypoMode = phase === 0 || phase === 1;
  const errorStart = 10;

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      {/* ── Typing Box – takes all available space ── */}
      <div className="grid-box border-white/8 p-0 flex flex-col flex-1 min-h-0" style={{ background: 'rgba(0,0,0,0.35)' }}>
        {/* top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Demo · Time 30s</span>
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${isInTypoMode ? 'text-error/60' : 'text-correct/60'}`}>
            {isInTypoMode ? '! error detected' : '∼ 72 wpm'}
          </span>
        </div>

        {/* text display – grows, clipped cleanly */}
        <div className="px-6 py-5 font-mono flex-1" style={{ minHeight: 0, overflow: 'hidden' }}>
          <div className="text-[15px] font-semibold tracking-wide" style={{ lineHeight: '2', wordBreak: 'break-word' }}>
            {text.split('').map((ch, i) => (
              <span key={i} className={isInTypoMode && i >= errorStart ? 'text-error bg-error/10' : 'text-correct'}>{ch}</span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.75, repeat: Infinity }}
              className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle"
            />
            <span className="text-on-surface-variant/8">
              {(phase === 2 ? fullText : phase === 0 ? typoText : fullText).slice(text.length)}
            </span>
          </div>
        </div>

        {/* stats bar */}
        <div className="flex items-center gap-6 px-5 py-3 border-t border-white/5 shrink-0" style={{ background: 'rgba(255,255,255,0.01)' }}>
          {[{ l: 'WPM', v: phase === 2 && text.length > 20 ? '68' : '—' },
            { l: 'ACC', v: phase === 2 ? '96%' : '—' },
            { l: 'RAW', v: '—' }].map(s => (
            <div key={s.l} className="flex items-baseline gap-1.5">
              <span className="text-[9px] font-bold text-on-surface-variant/20 uppercase tracking-widest">{s.l}</span>
              <span className="text-sm font-black text-on-surface-variant/50">{s.v}</span>
            </div>
          ))}
          <div className="ml-auto text-[9px] font-bold text-on-surface-variant/10 uppercase tracking-widest">TAB · RESTART</div>
        </div>
      </div>

      {/* ── Virtual Keyboard ── */}
      <div className="grid-box bg-black/20 border-white/5 px-3 py-3 flex flex-col items-center gap-1.5">
        {/* Row 0: ` 1 2 ... 0 - = + ⌫ */}
        <div className="flex gap-1">
          {KB_ROWS[0].map(key => (
            <VirtualKey key={key} label={key} active={activeKey === key} />
          ))}
          <VirtualKey label="⌫" active={activeKey === '⌫'} wide />
        </div>

        {/* Row 1: Tab + q...] */}
        <div className="flex gap-1">
          <VirtualKey label="tab" active={false} wide />
          {KB_ROWS[1].map(key => (
            <VirtualKey key={key} label={key} active={activeKey === key} />
          ))}
        </div>

        {/* Row 2: Caps + a...'; */}
        <div className="flex gap-1">
          <VirtualKey label="caps" active={false} wide />
          {KB_ROWS[2].map(key => (
            <VirtualKey key={key} label={key} active={activeKey === key} />
          ))}
          <VirtualKey label="enter" active={false} wide />
        </div>

        {/* Row 3: Shift + z.../ + ⌫ */}
        <div className="flex gap-1">
          <VirtualKey label="shift" active={false} extraWide />
          {KB_ROWS[3].map(key => (
            <VirtualKey key={key} label={key} active={activeKey === key} />
          ))}
          <VirtualKey label="shift" active={false} extraWide />
        </div>

        {/* Space row */}
        <div className="flex gap-1 items-center">
          <VirtualKey label="ctrl" active={false} wide />
          <VirtualKey label="alt" active={false} wide />
          <motion.div
            animate={activeKey === 'space'
              ? { scale: 0.93, backgroundColor: 'var(--color-primary)' }
              : { scale: 1, backgroundColor: 'rgba(255,255,255,0.02)' }
            }
            transition={{ duration: 0.08 }}
            className={`h-7 flex-1 rounded-sm border font-bold text-[9px] uppercase tracking-widest flex items-center justify-center select-none
              ${activeKey === 'space'
                ? 'border-primary text-background shadow-md shadow-primary/25'
                : 'border-white/8 text-on-surface-variant/15'
              }`}
          >
            space
          </motion.div>
          <VirtualKey label="alt" active={false} wide />
          <VirtualKey label="ctrl" active={false} wide />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    { 
      icon: <Database className="w-5 h-5" />, 
      title: "Edge Word Pools", 
      desc: "Globally distributed datasets powered by Supabase for a diverse, low-latency typing experience." 
    },
    { 
      icon: <RotateCw className="w-5 h-5" />, 
      title: "Dynamic Streaming", 
      desc: "Proprietary text-replenishing engine that sanitizes and randomizes word sets in real-time." 
    },
    { 
      icon: <BarChart3 className="w-5 h-5" />, 
      title: "Performance Intel", 
      desc: "Deep-level tracking of consistency, heatmaps, and key-by-key latency archived via Prisma." 
    },
    { 
      icon: <Layout className="w-5 h-5" />, 
      title: "Surgical Interface", 
      desc: "A distraction-free viewport optimized for sub-pixel alignment and maximum focusing range." 
    },
    { 
      icon: <Target className="w-5 h-5" />, 
      title: "Domain Selection", 
      desc: "Choose from 10,000+ words across specialized pools like Technical, Literature, and Code." 
    },
    { 
      icon: <ShieldCheck className="w-5 h-5" />, 
      title: "Verified Ranking", 
      desc: "A secured session validation system where every high score is verified and globally indexed." 
    },
  ];

  return (
    <div className="font-mono text-on-surface overflow-x-hidden">
      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative mt-16 min-h-[calc(100vh-64px)] flex flex-col justify-center overflow-hidden">

        {/* Grid bg */}
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right,#ffffff03 1px,transparent 1px),linear-gradient(to bottom,#ffffff03 1px,transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[700px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/3 left-0 w-[350px] h-[350px] bg-primary/3 rounded-full blur-[100px] -z-10" />

        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-10 flex flex-col h-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 xl:gap-14 h-full items-center">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-left flex flex-col"
            >
              {/* Headline */}
              <h1 className="font-black uppercase tracking-tighter leading-[0.9] mb-6 text-on-surface">
                <span className="block text-[clamp(2rem,4.5vw,3.5rem)] whitespace-nowrap">Type Faster.</span>
                <span className="block text-[clamp(2rem,4.5vw,3.5rem)] whitespace-nowrap"><span className="text-primary">Score</span> Higher.</span>
                <span className="block text-[clamp(2rem,4.5vw,3.5rem)] whitespace-nowrap"><span className="text-on-surface-variant/25 italic">Rank</span> First.</span>
              </h1>

              <div className="w-20 h-px bg-primary/40 mb-7" />

              <p className="text-[15px] font-medium text-on-surface-variant/45 leading-[1.8] max-w-[440px] mb-10">
                Horse Typing is a precision-engineered speed training platform.
                Train with 10,000+ curated word pools, track WPM history, and compete
                on a live global leaderboard — all in a premium, distraction-free interface.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Primary — glowing gradient */}
                <Link href="/practice" className="group relative overflow-hidden flex items-center gap-3 px-9 py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300">
                  {/* border */}
                  <span className="absolute inset-0 border border-primary/50 group-hover:border-primary transition-colors duration-300" />
                  {/* bg glow */}
                  <span className="absolute inset-0 bg-primary/12 group-hover:bg-primary/25 transition-colors duration-300" />
                  {/* shimmer on hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                  <span className="relative text-primary">Start Typing</span>
                  <ChevronRight className="relative w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                {/* Secondary — border glow fill */}
                <Link href="/leaderboard" className="group relative overflow-hidden flex items-center gap-3 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-300">
                  <span className="absolute inset-0 border border-white/8 group-hover:border-white/25 transition-colors duration-300" />
                  <span className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-colors duration-300" />
                  <span className="relative text-on-surface-variant/50 group-hover:text-on-surface-variant/80 transition-colors duration-200">Leaderboard</span>
                  <Trophy className="relative w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity duration-200" />
                </Link>
              </div>
            </motion.div>

            {/* ═══ RIGHT: Demo (typing + keyboard) ════════════════ */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="w-full flex flex-col"
            >
              <HeroDemo />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Feature Blueprint Grid */}
      <section className="px-6 md:px-12 max-w-[1250px] mx-auto py-20 border-t border-white/5 relative">
        <div className="absolute -left-20 top-40 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
           <h2 className="text-[12px] font-black text-primary uppercase tracking-[0.6em] mb-6">Feature Infrastructure</h2>
           <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Engineered for Mastery.</div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(153, 153, 153, 0.4)" }}
              className="grid-box border-white/5 p-10 bg-white/2 hover:bg-white/4 transition-colors group cursor-default"
            >
              <div className="grid-box w-10 h-10 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all mb-8">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-5 text-on-surface/90 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-[13px] font-bold text-on-surface-variant/40 leading-relaxed uppercase tracking-wider">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Operations/Process Section */}
      <section className="px-6 md:px-12 max-w-[1250px] mx-auto py-40 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-16"
           >
              <div className="space-y-6">
                 <h2 className="text-[12px] font-black text-primary uppercase tracking-[0.6em] mb-6">Training Workflow</h2>
                 <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight">The 3 Phases of Evolution.</div>
              </div>
              
              <div className="space-y-16">
                 {[
                   { step: "0.1", t: "Context Selection", d: "Initialize your session by choosing from curated word domains across our edge database." },
                   { step: "0.2", t: "Active Execution", d: "Experience zero-lag input processing with our hyper-responsive technical viewport." },
                   { step: "0.3", t: "Metric Extraction", d: "Analyze granular performance data and weak keys archived for professional review." },
                 ].map(s => (
                   <motion.div 
                      key={s.step} 
                      whileHover={{ x: 10 }}
                      className="flex gap-12 group"
                   >
                      <span className="text-5xl md:text-6xl font-black text-white/[0.05] group-hover:text-primary/20 transition-colors">{s.step}</span>
                      <div className="pt-3">
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4 group-hover:text-on-surface transition-colors">{s.t}</h4>
                        <p className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-widest leading-loose max-w-sm">{s.d}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </motion.div>
           
           <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="grid-box border-white/10 aspect-square relative bg-white/5 p-1 group overflow-hidden"
           >
              <div className="w-full h-full border border-white/5 bg-background flex items-center justify-center relative overflow-hidden group-hover:border-primary/20 transition-colors">
                 <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                    <div className="absolute inset-0 grid-lines-hero" />
                 </div>
                 <div className="z-10 text-center space-y-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <Terminal className="w-16 h-16 text-primary/40 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="text-[9px] font-bold text-primary/40 uppercase tracking-[0.8em] animate-pulse">Awaiting Authentication</div>
                    <Link href="/register" className="grid-box px-8 py-4 text-[9px] font-black tracking-[0.3em] uppercase border-primary/40 text-primary hover:bg-primary/20 transition-all block">Boot System Module</Link>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Global Metadata Section */}
      <section className="py-40 bg-zinc-950/20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10">
           {[ 
             {l: "Prisma Authenticated Users", v: "420K+", s: <Activity className="w-4 h-4" />}, 
             {l: "Mean Network Latency", v: "12ms", s: <Zap className="w-4 h-4" />}, 
             {l: "Supabase Test Cycles", v: "12.5M", s: <DatabaseBackup className="w-4 h-4" />} 
           ].map((m, i) => (
             <motion.div 
                key={m.l} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="space-y-6 group cursor-default"
             >
                <div className="flex items-center gap-4 text-primary mb-2">
                   {m.s}
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">{m.l}</span>
                </div>
                <span className="text-6xl md:text-7xl font-black text-on-surface tracking-tighter block group-hover:text-primary transition-colors">{m.v}</span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-1 bg-primary/40" 
                />
             </motion.div>
           ))}
        </div>
      </section>

      {/* Global Leaderboard Preview Section */}
      <section className="py-32 px-6 bg-zinc-950/40 relative border-t border-white/5">
         <div className="max-w-[1250px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Trophy className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Ranking Spectrum</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-on-surface">Verified Sessions.</h2>
               </div>
               <p className="text-[11px] font-bold text-on-surface-variant/30 uppercase tracking-[0.3em] max-w-sm leading-loose">
                  Real-time telemetry from the last 24 hours. Every session is verified with sub-pixel precision and archived in the Prisma Cloud.
               </p>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="grid-box border-white/5 bg-background overflow-hidden relative"
            >
               <div className="absolute inset-0 opacity-[0.02] grid-lines-hero pointer-events-none" />
               
               {/* Table Header */}
               <div className="grid grid-cols-[80px_1fr_100px_100px_120px] gap-4 px-8 py-5 border-b border-white/5 text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.4em] bg-white/1">
                  <span>Rank</span>
                  <span>Identity</span>
                  <span className="text-right">WPM</span>
                  <span className="text-right">ACC</span>
                  <span className="text-right">Word Pool</span>
               </div>

               {/* Table Rows */}
               {[
                 { r: "01", user: "0x_Phantom", wpm: "142.4", acc: "99.2", pool: "Kernic_Eng" },
                 { r: "02", user: "TypeAlchemist", wpm: "138.1", acc: "100.0", pool: "Core_Code" },
                 { r: "03", user: "SwiftNode", wpm: "135.9", acc: "98.7", pool: "English_1k" },
                 { r: "04", user: "BinaryGhost", wpm: "132.0", acc: "99.5", pool: "Technical" },
                 { r: "05", user: "Linear_Flow", wpm: "129.8", acc: "97.4", pool: "English_1k" },
               ].map((player, i) => (
                 <motion.div 
                   key={player.user}
                   whileHover={{ backgroundColor: "rgba(153, 153, 153, 0.03)" }}
                   className="grid grid-cols-[80px_1fr_100px_100px_120px] gap-4 px-8 py-6 border-b border-white/5 items-center transition-colors cursor-default"
                 >
                    <span className="text-lg font-black text-white/5 group-hover:text-primary/20">{player.r}</span>
                    <span className="text-xs font-black text-on-surface/80 uppercase tracking-widest">{player.user}</span>
                    <span className="text-right text-sm font-black text-primary/80 mono">{player.wpm}</span>
                    <span className="text-right text-xs font-bold text-on-surface-variant/40 mono">{player.acc}%</span>
                    <div className="flex justify-end">
                      <span className="text-[9px] px-2 py-1 bg-white/5 border border-white/5 rounded text-on-surface-variant/30 font-bold uppercase">{player.pool}</span>
                    </div>
                 </motion.div>
               ))}

               {/* Table Footer / CTA */}
               <div className="p-12 text-center bg-white/1 relative">
                  <div className="space-y-8 max-w-lg mx-auto">
                     <p className="text-[10px] font-bold text-on-surface-variant/20 uppercase tracking-[0.4em]">Initialize your own verified session</p>
                     <div className="flex flex-col items-center gap-6">
                        <Link href="/register" className="grid-box bg-primary/10 border-primary/40 text-primary font-black px-12 py-5 text-[11px] uppercase tracking-[0.4em] hover:bg-primary/20 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                           Claim Your Identity
                        </Link>
                        <Link href="/login" className="text-[9px] font-black text-on-surface-variant/30 hover:text-on-surface transition-colors uppercase tracking-[0.4em]">Existing operative? Sign in here</Link>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      <style jsx global>{`
        .grid-lines-hero {
           background-image: 
            linear-gradient(to right, #ffffff05 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff05 1px, transparent 1px);
           background-size: 20px 20px;
        }
        .perspective-1000 {
           perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

// Separate component for Lucide Trophy to avoid hydration issues if it was missing in scope
function Trophy({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V18" /><path d="M14 22V18" /><path d="M18 4H6v11a6 6 0 0 0 12 0V4Z" />
    </svg>
  );
}
