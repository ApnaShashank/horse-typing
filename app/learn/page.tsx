'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronRight, ChevronDown, Lock, Check,
  Zap, Flame, Trophy, Keyboard, Play, Menu, X
} from 'lucide-react';
import { LESSONS, DIFFICULTY_GROUPS, getDifficultyColor, type Difficulty, type Lesson } from './lessonData';
import LearnEngine, { type LessonResult } from './LearnEngine';

// ─── Progress Storage ─────────────────────────────────────────────
const STORAGE_KEY = 'ht_learn_progress';
const XP_KEY      = 'ht_total_xp';
const STREAK_KEY  = 'ht_streak';

type ProgressEntry = {
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  xpEarned: number;
};
type ProgressData = Record<number, ProgressEntry>;
type StreakData   = { count: number; lastDate: string };

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadXP(): number {
  try { return parseInt(localStorage.getItem(XP_KEY) || '0', 10); }
  catch { return 0; }
}
function loadStreak(): StreakData {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}'); }
  catch { return { count: 0, lastDate: '' }; }
}
function updateStreak(): StreakData {
  const today = new Date().toDateString();
  const s = loadStreak();
  const yesterday = new Date(Date.now() - 864e5).toDateString();
  const newCount = s.lastDate === today ? s.count : s.lastDate === yesterday ? s.count + 1 : 1;
  const updated: StreakData = { count: newCount, lastDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

function isLessonUnlocked(lessonId: number, progress: ProgressData, isLoggedIn: boolean): boolean {
  if (isLoggedIn) return true;
  if (lessonId === 1) return true;
  return Boolean(progress[lessonId - 1]?.completed);
}

function getNextUnlockedLesson(progress: ProgressData, isLoggedIn: boolean): Lesson {
  for (const lesson of LESSONS) {
    if (!progress[lesson.id]?.completed && isLessonUnlocked(lesson.id, progress, isLoggedIn)) {
      return lesson;
    }
  }
  return LESSONS[LESSONS.length - 1];
}

function countCompleted(progress: ProgressData): number {
  return Object.values(progress).filter(p => p.completed).length;
}

// ─── Sidebar Lesson Item ──────────────────────────────────────────
function LessonItem({
  lesson, isSelected, isUnlocked, isCompleted, progress, onClick,
}: {
  lesson: Lesson;
  isSelected: boolean;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress?: ProgressEntry;
  onClick: () => void;
}) {
  const diffColor = getDifficultyColor(lesson.difficulty);
  const locked = !isUnlocked;

  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      whileHover={!locked ? { x: 2 } : {}}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-l-2 ${
        isSelected
          ? 'bg-primary/8 border-l-primary'
          : locked
          ? 'opacity-40 cursor-not-allowed border-l-transparent'
          : 'hover:bg-white/[0.03] border-l-transparent hover:border-l-white/10 cursor-pointer'
      }`}
    >
      {/* Level badge */}
      <div
        className="w-8 h-8 flex items-center justify-center rounded-sm font-black text-[10px] flex-shrink-0 border"
        style={
          isCompleted
            ? { backgroundColor: `${diffColor}20`, borderColor: `${diffColor}50`, color: diffColor }
            : isSelected
            ? { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#e0e0e0' }
            : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
        }
      >
        {lesson.level}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-bold uppercase tracking-wide truncate ${
          isSelected ? 'text-on-surface' : 'text-on-surface-variant/55'
        }`}>
          {lesson.title}
        </div>
        {isCompleted && progress && (
          <div className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest mt-0.5">
            {progress.bestWpm} wpm · {progress.bestAccuracy}%
          </div>
        )}
        {!isCompleted && isUnlocked && (
          <div className="text-[9px] font-bold text-on-surface-variant/25 uppercase tracking-widest mt-0.5">
            {lesson.target_wpm}+ wpm · {lesson.target_accuracy}%+
          </div>
        )}
      </div>

      {/* Status icon */}
      <div className="flex-shrink-0">
        {locked
          ? <Lock className="w-3.5 h-3.5 text-on-surface-variant/25" />
          : isCompleted
          ? <span className="flex items-center gap-1 text-[8px] font-black text-correct uppercase tracking-wider bg-correct/10 px-1 py-0.5 rounded border border-correct/20 shrink-0">Mastered</span>
          : progress && progress.attempts > 0
          ? <span className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-wider bg-primary/10 px-1 py-0.5 rounded border border-primary/20 shrink-0">Practiced</span>
          : isSelected
          ? <ChevronRight className="w-3.5 h-3.5 text-primary/60" />
          : <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
        }
      </div>
    </motion.button>
  );
}

// ─── Difficulty Group ─────────────────────────────────────────────
function DifficultyGroup({
  label, difficulty, range, progress, selectedId, onSelect, defaultOpen, isLoggedIn,
}: {
  label: string;
  difficulty: Difficulty;
  range: [number, number];
  progress: ProgressData;
  selectedId: number | null;
  onSelect: (id: number) => void;
  defaultOpen: boolean;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const color = getDifficultyColor(difficulty);
  const groupLessons = LESSONS.filter(l => l.level >= range[0] && l.level <= range[1]);
  const completedCount = groupLessons.filter(l => progress[l.id]?.completed).length;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="flex-1 text-[10px] font-black uppercase tracking-[0.4em] text-left" style={{ color }}>
          {label}
        </span>
        <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">
          {completedCount}/{groupLessons.length}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" style={{ color: `${color}60` }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {groupLessons.map(lesson => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isSelected={selectedId === lesson.id}
                isUnlocked={isLessonUnlocked(lesson.id, progress, isLoggedIn)}
                isCompleted={Boolean(progress[lesson.id]?.completed)}
                progress={progress[lesson.id]}
                onClick={() => onSelect(lesson.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────
function WelcomeScreen({
  progress, totalXP, streak, onStart, isLoggedIn,
}: {
  progress: ProgressData;
  totalXP: number;
  streak: StreakData;
  onStart: (id: number) => void;
  isLoggedIn: boolean;
}) {
  const completed = countCompleted(progress);
  const nextLesson = getNextUnlockedLesson(progress, isLoggedIn);
  const allDone = completed === LESSONS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 p-8 max-w-3xl mx-auto w-full"
    >
      {/* Hero */}
      <div className="grid-box p-10 text-center relative overflow-hidden bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10">
          <div className="grid-box w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-primary/5">
            <Keyboard className="w-8 h-8 text-primary/60" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-on-surface mb-4 leading-tight">
            Touch Typing<br /><span className="text-primary">Curriculum</span>
          </h1>
          <p className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] leading-loose max-w-md mx-auto">
            56 structured lessons from F&amp;J to full symbol mastery.
            Build real muscle memory — key by key.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Check className="w-4 h-4" />, label: 'Completed', value: `${completed}/56`, color: '#4ade80' },
          { icon: <Zap className="w-4 h-4" />, label: 'Total XP', value: totalXP.toLocaleString(), color: '#fbbf24' },
          { icon: <Flame className="w-4 h-4" />, label: 'Streak', value: `${streak.count}d`, color: '#fb923c' },
        ].map(s => (
          <div key={s.label} className="grid-box p-5 text-center bg-white/[0.015]">
            <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-on-surface-variant/30">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Next lesson CTA */}
      {!allDone && (
        <div className="grid-box p-6 bg-white/[0.015]">
          <div className="text-[10px] font-black uppercase tracking-[0.45em] text-on-surface-variant/30 mb-4">
            {completed === 0 ? 'Start here' : 'Continue where you left off'}
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div
              className="grid-box w-12 h-12 flex items-center justify-center font-black text-lg flex-shrink-0"
              style={{ backgroundColor: `${getDifficultyColor(nextLesson.difficulty)}15`, borderColor: `${getDifficultyColor(nextLesson.difficulty)}40`, color: getDifficultyColor(nextLesson.difficulty) }}
            >
              {nextLesson.level}
            </div>
            <div>
              <div className="text-base font-black uppercase tracking-wide text-on-surface">{nextLesson.title}</div>
              <div className="text-[11px] text-on-surface-variant/40 font-bold uppercase tracking-widest">{nextLesson.subtitle}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
            onClick={() => onStart(nextLesson.id)}
            className="w-full grid-box py-4 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:bg-primary/10 transition-all border-primary/40"
          >
            <Play className="w-4 h-4 fill-current" />
            {completed === 0 ? 'Begin Lesson 1' : `Continue — L${nextLesson.level}`}
          </motion.button>
        </div>
      )}

      {allDone && (
        <div className="grid-box p-8 text-center bg-white/[0.015] border-primary/20">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]" />
          <div className="text-2xl font-black uppercase tracking-tighter text-primary mb-2">Curriculum Complete!</div>
          <div className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-wider">
            All 56 lessons mastered. You are a touch-typing expert.
          </div>
        </div>
      )}

      {/* Curriculum overview */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-on-surface-variant/30 mb-4">Curriculum Map</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIFFICULTY_GROUPS.map(g => {
            const groupLessons = LESSONS.filter(l => l.level >= g.range[0] && l.level <= g.range[1]);
            const done = groupLessons.filter(l => progress[l.id]?.completed).length;
            const color = getDifficultyColor(g.difficulty);
            return (
              <div key={g.label} className="grid-box p-4 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color }}>{g.label}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/30">{done}/{groupLessons.length}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${groupLessons.length > 0 ? (done / groupLessons.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="text-[9px] text-on-surface-variant/25 uppercase tracking-widest mt-1.5">
                  L{g.range[0]}–L{g.range[1]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Learn Page ──────────────────────────────────────────────
export default function LearnPage() {
  const [progress, setProgress]         = useState<ProgressData>({});
  const [totalXP, setTotalXP]           = useState(0);
  const [streak, setStreak]             = useState<StreakData>({ count: 0, lastDate: '' });
  const [selectedId, setSelectedId]     = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [engineKey, setEngineKey]       = useState(0); // force re-mount on retry
  const [user, setUser]                 = useState<any>(null);

  // Load from localStorage on mount & check query params and login status
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalXP(loadXP());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(loadStreak());

    // Check if user is logged in
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.authenticated) {
          setUser(d.user);
        }
      })
      .catch(() => {});

    // Check query params for redirected lesson suggestions
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get('lesson');
      if (lessonParam) {
        const lid = parseInt(lessonParam, 10);
        if (lid >= 1 && lid <= 56) {
          setSelectedId(lid);
        }
      }
    }
  }, []);

  const selectedLesson = selectedId ? LESSONS.find(l => l.id === selectedId) ?? null : null;

  const handleLessonComplete = useCallback((result: LessonResult) => {
    setProgress(prev => {
      const existing = prev[selectedId!] || { completed: false, bestWpm: 0, bestAccuracy: 0, attempts: 0, xpEarned: 0 };
      const updated: ProgressEntry = {
        completed:    existing.completed || result.passed,
        bestWpm:      Math.max(existing.bestWpm, result.wpm),
        bestAccuracy: Math.max(existing.bestAccuracy, result.accuracy),
        attempts:     existing.attempts + 1,
        xpEarned:     existing.xpEarned + result.xpEarned,
      };
      const next: ProgressData = { ...prev, [selectedId!]: updated };
      saveProgress(next);
      return next;
    });

    setTotalXP(prev => {
      const next = prev + result.xpEarned;
      localStorage.setItem(XP_KEY, String(next));
      return next;
    });

    setStreak(updateStreak());

    // Auto-advance to next lesson if passed
    if (result.passed && selectedId !== null) {
      const nextLesson = LESSONS.find(l => l.id === selectedId + 1);
      if (nextLesson) {
        setTimeout(() => {
          setSelectedId(nextLesson.id);
          setEngineKey(k => k + 1);
          setSidebarOpen(false);
        }, 600);
      }
    }
  }, [selectedId]);

  const handleSelectLesson = (id: number) => {
    setSelectedId(id);
    setEngineKey(k => k + 1);
    setSidebarOpen(false);
  };

  // Determine default open group based on progress
  const completedCount = countCompleted(progress);
  let defaultOpenGroup: Difficulty = 'beginner';
  if (completedCount >= 39) defaultOpenGroup = 'expert';
  else if (completedCount >= 24) defaultOpenGroup = 'advanced';
  else if (completedCount >= 10) defaultOpenGroup = 'intermediate';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid-box p-1.5 bg-primary/5">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.3em] text-on-surface">Curriculum</div>
            <div className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">56 Lessons</div>
          </div>
        </div>

        {/* XP + Streak */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid-box p-2.5 text-center bg-white/[0.015]">
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30 mb-1 flex items-center justify-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400/60" /> XP
            </div>
            <div className="text-base font-black text-amber-400/80">{totalXP.toLocaleString()}</div>
          </div>
          <div className="grid-box p-2.5 text-center bg-white/[0.015]">
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30 mb-1 flex items-center justify-center gap-1">
              <Flame className="w-2.5 h-2.5 text-orange-400/60" /> Streak
            </div>
            <div className="text-base font-black text-orange-400/80">{streak.count}d</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[8px] font-bold text-on-surface-variant/25 uppercase tracking-widest mb-1">
            <span>Progress</span>
            <span>{completedCount}/56</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(completedCount / 56) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-primary/60 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Lesson list - scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {DIFFICULTY_GROUPS.map(g => (
          <DifficultyGroup
            key={g.difficulty}
            label={g.label}
            difficulty={g.difficulty}
            range={g.range}
            progress={progress}
            selectedId={selectedId}
            onSelect={handleSelectLesson}
            defaultOpen={g.difficulty === defaultOpenGroup}
            isLoggedIn={!!user}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] mt-14 overflow-hidden font-mono text-on-surface">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[268px] flex-shrink-0 border-r border-white/5 bg-surface-container-low overflow-hidden">
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed left-0 top-14 bottom-0 w-[268px] z-50 border-r border-white/5 bg-surface-container-low overflow-hidden flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Lessons</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-white/5 rounded-sm transition-colors">
                  <X className="w-4 h-4 text-on-surface-variant" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">{sidebarContent}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-background/50 backdrop-blur-md flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="grid-box p-2 hover:bg-white/5 transition-colors">
            <Menu className="w-4 h-4 text-on-surface-variant" />
          </button>
          {selectedLesson ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">L{selectedLesson.level}</span>
              <span className="text-[11px] font-bold text-on-surface/70 uppercase tracking-wide truncate">{selectedLesson.title}</span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-on-surface-variant/50">Select a Lesson</span>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {selectedLesson ? (
              <motion.div
                key={`engine-${selectedLesson.id}-${engineKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <LearnEngine
                  key={`${selectedLesson.id}-${engineKey}`}
                  lesson={selectedLesson}
                  onComplete={handleLessonComplete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <WelcomeScreen
                  progress={progress}
                  totalXP={totalXP}
                  streak={streak}
                  onStart={handleSelectLesson}
                  isLoggedIn={!!user}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
