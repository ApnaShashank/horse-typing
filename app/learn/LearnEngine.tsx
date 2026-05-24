'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Play, Zap, Target } from 'lucide-react';
import {
  Lesson, KEY_FINGER_MAP, FINGER_COLORS, FINGER_DISPLAY_NAMES, getDifficultyColor
} from './lessonData';
import { generatePracticeText } from './textGenerator';

// ─── Keyboard Constants ───────────────────────────────────────────
const KB_ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
];

const SHIFTED_TO_BASE: Record<string, string> = {
  '!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0',
  '_':'-','+':'=','{':'[','}':']','|':'\\',':':';','"':"'",'<':',','>':'.','?':'/','~':'`',
};

function getPhysicalKey(char: string): string {
  return SHIFTED_TO_BASE[char] || char.toLowerCase();
}

function isShiftRequired(char: string): boolean {
  return Boolean(SHIFTED_TO_BASE[char]) || /^[A-Z]$/.test(char);
}

// ─── Types ────────────────────────────────────────────────────────
export type LessonResult = {
  wpm: number;
  accuracy: number;
  errors: number;
  elapsed: number;
  passed: boolean;
  xpEarned: number;
  weakKeys: Record<string, number>;
};

type FlashState = { key: string; correct: boolean } | null;
type Phase = 'intro' | 'typing' | 'finished';

// ─── Single Key Component ─────────────────────────────────────────
interface VKeyProps {
  label: string;
  physKey: string;
  targetPhysKey: string;
  flashState: FlashState;
  wide?: boolean;
  extraWide?: boolean;
  dim?: boolean;
}

const VKey = memo(({ label, physKey, targetPhysKey, flashState, wide, extraWide, dim }: VKeyProps) => {
  const isTarget = physKey === targetPhysKey;
  const isFlashing = flashState && getPhysicalKey(flashState.key) === physKey;
  const finger = KEY_FINGER_MAP[physKey];
  const fingerColor = finger ? FINGER_COLORS[finger] : null;

  let animTarget: any;

  if (isFlashing && flashState) {
    const c = flashState.correct;
    animTarget = {
      backgroundColor: c ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)',
      borderColor: c ? '#4ade80' : '#f87171',
      color: c ? '#4ade80' : '#f87171',
      boxShadow: c ? '0 0 12px rgba(74,222,128,0.4)' : '0 0 12px rgba(248,113,113,0.4)',
      scale: 0.87,
    };
  } else if (isTarget) {
    animTarget = {
      backgroundColor: 'rgba(251,191,36,0.18)',
      borderColor: '#fbbf24',
      color: '#fbbf24',
      boxShadow: '0 0 18px rgba(251,191,36,0.4)',
      scale: 1,
    };
  } else if (dim) {
    animTarget = {
      backgroundColor: 'rgba(255,255,255,0.02)',
      borderColor: 'rgba(255,255,255,0.07)',
      color: 'rgba(255,255,255,0.13)',
      boxShadow: 'none', scale: 1,
    };
  } else {
    animTarget = {
      backgroundColor: fingerColor ? `${fingerColor}09` : 'rgba(255,255,255,0.02)',
      borderColor: fingerColor ? `${fingerColor}28` : 'rgba(255,255,255,0.08)',
      color: fingerColor ? `${fingerColor}65` : 'rgba(255,255,255,0.25)',
      boxShadow: 'none', scale: 1,
    };
  }

  const width = extraWide ? 'min-w-[54px]' : wide ? 'min-w-[38px]' : 'min-w-[26px]';

  return (
    <motion.div
      animate={animTarget}
      transition={{ duration: 0.07 }}
      className={`flex items-center justify-center rounded-[3px] border font-bold select-none
        text-[9.5px] uppercase tracking-wide h-[28px] px-1 ${width}`}
    >
      {label}
    </motion.div>
  );
});
VKey.displayName = 'VKey';

// ─── Full Virtual Keyboard ────────────────────────────────────────
interface VirtualKeyboardProps {
  targetChar: string;
  flashState: FlashState;
}

const VirtualKeyboard = memo(({ targetChar, flashState }: VirtualKeyboardProps) => {
  const targetPhysKey = getPhysicalKey(targetChar);
  const shifting = isShiftRequired(targetChar);
  const isSpace = targetChar === ' ';

  const shiftAnim = shifting
    ? { backgroundColor:'rgba(251,191,36,0.18)', borderColor:'#fbbf24', color:'#fbbf24', boxShadow:'0 0 14px rgba(251,191,36,0.35)', scale:1 }
    : { backgroundColor:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.13)', boxShadow:'none', scale:1 };

  const spaceAnim = isSpace
    ? { backgroundColor:'rgba(251,191,36,0.18)', borderColor:'#fbbf24', color:'#fbbf24', boxShadow:'0 0 18px rgba(251,191,36,0.4)' }
    : { backgroundColor:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.12)', boxShadow:'none' };

  return (
    <div className="flex flex-col items-center gap-[3px] select-none font-mono">
      {/* Number Row */}
      <div className="flex gap-[3px]">
        {KB_ROWS[0].map(k => (
          <VKey key={k} label={k} physKey={k} targetPhysKey={targetPhysKey} flashState={flashState} />
        ))}
        <VKey label="⌫" physKey="⌫" targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
      </div>

      {/* Top Row */}
      <div className="flex gap-[3px]">
        <VKey label="tab" physKey="tab" targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
        {KB_ROWS[1].map(k => (
          <VKey key={k} label={k} physKey={k} targetPhysKey={targetPhysKey} flashState={flashState} />
        ))}
      </div>

      {/* Home Row */}
      <div className="flex gap-[3px]">
        <VKey label="caps" physKey="caps" targetPhysKey={targetPhysKey} flashState={flashState} extraWide dim />
        {KB_ROWS[2].map(k => (
          <VKey key={k} label={k} physKey={k} targetPhysKey={targetPhysKey} flashState={flashState} />
        ))}
        <VKey label="enter" physKey="enter" targetPhysKey={targetPhysKey} flashState={flashState} extraWide dim />
      </div>

      {/* Bottom Row */}
      <div className="flex gap-[3px]">
        <motion.div animate={shiftAnim} transition={{ duration: 0.07 }}
          className="min-w-[62px] h-[28px] flex items-center justify-center rounded-[3px] border text-[9.5px] font-bold uppercase tracking-wide">
          shift
        </motion.div>
        {KB_ROWS[3].map(k => (
          <VKey key={k} label={k} physKey={k} targetPhysKey={targetPhysKey} flashState={flashState} />
        ))}
        <motion.div animate={shiftAnim} transition={{ duration: 0.07 }}
          className="min-w-[62px] h-[28px] flex items-center justify-center rounded-[3px] border text-[9.5px] font-bold uppercase tracking-wide">
          shift
        </motion.div>
      </div>

      {/* Space Row */}
      <div className="flex gap-[3px] w-full max-w-[488px]">
        <VKey label="ctrl" physKey="ctrl" targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
        <VKey label="alt"  physKey="alt"  targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
        <motion.div animate={spaceAnim} transition={{ duration: 0.07 }}
          className="flex-1 h-[28px] flex items-center justify-center rounded-[3px] border text-[9.5px] font-bold uppercase tracking-widest">
          space
        </motion.div>
        <VKey label="alt"  physKey="alt"  targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
        <VKey label="ctrl" physKey="ctrl" targetPhysKey={targetPhysKey} flashState={flashState} wide dim />
      </div>

      {/* Shift reminder */}
      <AnimatePresence>
        {shifting && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70 animate-pulse mt-1"
          >
            ↑ Hold Shift
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
VirtualKeyboard.displayName = 'VirtualKeyboard';

// ─── Text Display ─────────────────────────────────────────────────
const TextDisplay = memo(({ flatText, typedChars }: { flatText: string; typedChars: string }) => (
  <div className="font-mono text-[21px] md:text-[24px] leading-[2.4] tracking-[0.08em] select-none break-all">
    {flatText.split('').map((char, i) => {
      const typed    = i < typedChars.length;
      const isCur    = i === typedChars.length;
      const correct  = typed && typedChars[i] === char;
      const wrong    = typed && typedChars[i] !== char;

      return (
        <span
          key={i}
          className={`relative
            ${correct ? 'text-correct' : ''}
            ${wrong   ? 'text-error bg-error/10 rounded-sm' : ''}
            ${!typed && !isCur ? 'text-on-surface-variant/22' : ''}
            ${isCur   ? 'text-on-surface' : ''}
          `}
        >
          {isCur && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.85, repeat: Infinity }}
              className="absolute left-0 top-[6px] bottom-[6px] w-[2px] bg-primary rounded-full"
            />
          )}
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    })}
    {typedChars.length >= flatText.length && flatText.length > 0 && (
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.85, repeat: Infinity }}
        className="inline-block w-[2px] h-[0.8em] bg-primary rounded-full align-middle ml-0.5"
      />
    )}
  </div>
));
TextDisplay.displayName = 'TextDisplay';

// ─── Finger Hint ──────────────────────────────────────────────────
function FingerHint({ targetChar }: { targetChar: string }) {
  if (!targetChar) return null;

  if (targetChar === ' ') {
    return (
      <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400/50">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-400/40" />
        Thumb → Space Bar
      </div>
    );
  }

  const physKey  = getPhysicalKey(targetChar);
  const finger   = KEY_FINGER_MAP[physKey] || KEY_FINGER_MAP[physKey.toLowerCase()];
  const color    = finger ? FINGER_COLORS[finger] : '#666';
  const name     = finger ? FINGER_DISPLAY_NAMES[finger] : 'Unknown finger';
  const shifting = isShiftRequired(targetChar);
  const display  = targetChar === ' ' ? 'Space' : `"${targetChar}"`;

  return (
    <motion.div
      key={targetChar}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.12 }}
      className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest"
    >
      <motion.div
        animate={{ backgroundColor: color, boxShadow: `0 0 8px ${color}55` }}
        transition={{ duration: 0.1 }}
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
      />
      <span style={{ color }}>
        {shifting ? <span className="text-amber-400/80 mr-1">Shift +</span> : null}
        {name} → {display}
      </span>
    </motion.div>
  );
}

// ─── Finger Legend ────────────────────────────────────────────────
function FingerLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(FINGER_COLORS).filter(([f]) => f !== 'thumb').map(([finger, color]) => (
        <div key={finger} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: `${color}70` }}>
            {FINGER_DISPLAY_NAMES[finger]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main LearnEngine Export ──────────────────────────────────────
interface LearnEngineProps {
  lesson: Lesson;
  onComplete: (result: LessonResult) => void;
}

export default function LearnEngine({ lesson, onComplete }: LearnEngineProps) {
  const [phase, setPhase]           = useState<Phase>('intro');
  const [typedChars, setTypedChars] = useState('');
  const [elapsed, setElapsed]       = useState(0);
  const [flashState, setFlashState] = useState<FlashState>(null);
  const [result, setResult]         = useState<LessonResult | null>(null);
  const [, forceRender]             = useState(0); // to trigger re-render for live stats

  // Stable refs for use inside event handlers
  const phaseRef           = useRef<Phase>('intro');
  const typedRef           = useRef('');
  const flatTextRef        = useRef('');
  const startTimeRef       = useRef<number | null>(null);
  const errorCountRef      = useRef(0);
  const weakKeysRef        = useRef<Record<string, number>>({});
  const flashTimeout       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef        = useRef(false);
  const onCompleteRef      = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Generate flat practice text
  const flatText = useMemo(() => {
    const words = generatePracticeText(lesson, 40);
    return words.join(' ');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  // Sync phase ref
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Sync flatText ref
  useEffect(() => { flatTextRef.current = flatText; }, [flatText]);

  // Reset everything on lesson change
  useEffect(() => {
    setPhase('intro');
    setTypedChars('');
    setElapsed(0);
    setFlashState(null);
    setResult(null);
    startTimeRef.current    = null;
    errorCountRef.current   = 0;
    weakKeysRef.current     = {};
    finishedRef.current     = false;
    phaseRef.current        = 'intro';
  }, [lesson.id]);

  // Timer loop
  useEffect(() => {
    if (phase !== 'typing') return;
    const id = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed((performance.now() - startTimeRef.current) / 1000);
        forceRender(n => n + 1); // refresh live stats
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  const doFinishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const finalElapsed = startTimeRef.current
      ? (performance.now() - startTimeRef.current) / 1000
      : 1;

    // Calculate correct characters dynamically to prevent backspace/retype inflation
    const currentTyped = typedRef.current;
    const currentFlat = flatTextRef.current;
    let correct = 0;
    for (let i = 0; i < currentTyped.length; i++) {
      if (currentTyped[i] === currentFlat[i]) {
        correct++;
      }
    }

    const errors   = errorCountRef.current;
    const total    = correct + errors;
    const wpm      = Math.round((correct / 5) / (finalElapsed / 60));
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
    const passed   = wpm >= lesson.target_wpm && accuracy >= lesson.target_accuracy;
    const xpEarned = passed
      ? Math.round(lesson.xp * (accuracy / 100))
      : Math.round(lesson.xp * 0.1);

    const r: LessonResult = {
      wpm, accuracy, errors,
      elapsed: finalElapsed,
      passed, xpEarned,
      weakKeys: { ...weakKeysRef.current },
    };
    setElapsed(finalElapsed);
    setResult(r);
    setPhase('finished');
  }, [lesson]);

  // Global keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phaseRef.current !== 'typing') return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const prev = typedRef.current;
      const next = prev.slice(0, -1);
      typedRef.current = next;
      setTypedChars(next);
      return;
    }

    if (e.key === 'Tab') { e.preventDefault(); return; }
    if (e.key.length !== 1) return;

    const currentTyped = typedRef.current;
    const currentFlat  = flatTextRef.current;
    const targetChar   = currentFlat[currentTyped.length];
    if (!targetChar) return;

    if (!startTimeRef.current) startTimeRef.current = performance.now();

    const isCorrect = e.key === targetChar;
    if (!isCorrect) {
      errorCountRef.current++;
      weakKeysRef.current[targetChar] = (weakKeysRef.current[targetChar] || 0) + 1;
    }

    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setFlashState({ key: e.key, correct: isCorrect });
    flashTimeout.current = setTimeout(() => setFlashState(null), 130);

    const newTyped = currentTyped + e.key;
    typedRef.current = newTyped;
    setTypedChars(newTyped);

    if (newTyped.length >= currentFlat.length) {
      setTimeout(doFinishLesson, 250);
    }
  }, [doFinishLesson]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Derived live stats
  const liveCorrect = typedChars.split('').reduce((acc, char, idx) => {
    return acc + (char === flatText[idx] ? 1 : 0);
  }, 0);
  const liveErrors   = errorCountRef.current;
  const liveTotal    = liveCorrect + liveErrors;
  const liveWpm      = (elapsed > 0 && startTimeRef.current)
    ? Math.max(0, Math.round((liveCorrect / 5) / (elapsed / 60)))
    : 0;
  const liveAccuracy = liveTotal > 0
    ? Math.round((liveCorrect / liveTotal) * 100)
    : 100;
  const progress  = flatText.length > 0 ? Math.min(1, typedChars.length / flatText.length) : 0;
  const targetChar = flatText[typedChars.length] || '';
  const diffColor  = getDifficultyColor(lesson.difficulty);

  const resetToIntro = () => {
    setPhase('intro');
    setTypedChars('');
    setElapsed(0);
    setFlashState(null);
    setResult(null);
    typedRef.current        = '';
    startTimeRef.current    = null;
    errorCountRef.current   = 0;
    weakKeysRef.current     = {};
    finishedRef.current     = false;
    phaseRef.current        = 'intro';
  };

  // ── INTRO PHASE ────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <motion.div
        key="intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-7 p-8 max-w-3xl mx-auto w-full"
      >
        {/* Header */}
        <div className="flex items-start gap-5">
          <div
            className="grid-box w-14 h-14 flex items-center justify-center flex-shrink-0 text-xl font-black"
            style={{ backgroundColor: `${diffColor}12`, borderColor: `${diffColor}45`, color: diffColor }}
          >
            {lesson.level}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: diffColor }}>
                Level {lesson.level} · {lesson.difficulty}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/25 grid-box px-2 py-0.5">
                {lesson.type}
              </span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-on-surface leading-tight">{lesson.title}</h2>
            <p className="text-sm text-on-surface-variant/45 font-bold uppercase tracking-wider mt-1">{lesson.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <div className="grid-box p-5 bg-white/[0.015]">
          <p className="text-sm font-medium text-on-surface-variant/55 leading-relaxed">{lesson.description}</p>
        </div>

        {/* Keys to learn */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.45em] text-on-surface-variant/30 mb-3">Keys in this lesson</div>
          <div className="flex flex-wrap gap-2">
            {lesson.keys.map(k => {
              const finger = KEY_FINGER_MAP[k] || KEY_FINGER_MAP[k.toLowerCase()];
              const color  = finger ? FINGER_COLORS[finger] : '#666';
              return (
                <div key={k} className="flex flex-col items-center gap-1">
                  <motion.div
                    whileHover={{ scale: 1.12, y: -2 }}
                    className="grid-box w-10 h-10 flex items-center justify-center text-sm font-black uppercase cursor-default"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}50`, color }}
                  >
                    {k === ' ' ? '␣' : k}
                  </motion.div>
                  {finger && (
                    <span className="text-[8px] font-bold uppercase tracking-wide text-center leading-tight" style={{ color: `${color}70` }}>
                      {FINGER_DISPLAY_NAMES[finger]?.replace('Left ', 'L.').replace('Right ', 'R.')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Targets */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid-box p-5 bg-white/[0.015]">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30 mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Target WPM
            </div>
            <div className="text-4xl font-black text-primary">{lesson.target_wpm}</div>
            <div className="text-[10px] text-on-surface-variant/25 mt-1 uppercase tracking-widest">words per min</div>
          </div>
          <div className="grid-box p-5 bg-white/[0.015]">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30 mb-2 flex items-center gap-2">
              <Target className="w-3 h-3" /> Target Accuracy
            </div>
            <div className="text-4xl font-black text-correct">{lesson.target_accuracy}%</div>
            <div className="text-[10px] text-on-surface-variant/25 mt-1 uppercase tracking-widest">correct keystrokes</div>
          </div>
        </div>

        {/* Finger color legend */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.45em] text-on-surface-variant/30 mb-3">Finger color guide</div>
          <FingerLegend />
        </div>

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase('typing')}
          className="grid-box w-full py-5 flex items-center justify-center gap-3 text-[12px] font-black uppercase tracking-[0.4em] transition-all"
          style={{ borderColor: `${diffColor}55`, backgroundColor: `${diffColor}10`, color: diffColor }}
        >
          <Play className="w-4 h-4 fill-current" />
          Start Lesson — Press Any Key
        </motion.button>
      </motion.div>
    );
  }

  // ── RESULT PHASE ───────────────────────────────────────────────
  if (phase === 'finished' && result) {
    const topWeakKeys = Object.entries(result.weakKeys).sort(([,a],[,b]) => b - a).slice(0, 8);

    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 p-8 max-w-3xl mx-auto w-full"
      >
        {/* Pass/Fail hero */}
        <div className={`grid-box p-8 text-center relative overflow-hidden ${result.passed ? 'border-correct/40' : 'border-error/40'}`}
          style={{ background: result.passed ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.04)' }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-4 relative z-10"
          >
            {result.passed
              ? <CheckCircle2 className="w-16 h-16 text-correct drop-shadow-[0_0_16px_rgba(74,222,128,0.6)]" />
              : <XCircle className="w-16 h-16 text-error drop-shadow-[0_0_16px_rgba(248,113,113,0.6)]" />
            }
          </motion.div>
          <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 relative z-10 ${result.passed ? 'text-correct' : 'text-error'}`}>
            {result.passed ? 'Lesson Complete!' : 'Keep Practicing!'}
          </h2>
          <p className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-[0.35em] relative z-10">
            {result.passed
              ? `+${result.xpEarned} XP Earned · Next lesson unlocked`
              : `Need ${lesson.target_wpm} WPM & ${lesson.target_accuracy}% accuracy to pass`
            }
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'WPM', value:result.wpm, color:'text-primary', met: result.wpm >= lesson.target_wpm, target:`/${lesson.target_wpm}` },
            { label:'Accuracy', value:`${result.accuracy}%`, color:'text-correct', met: result.accuracy >= lesson.target_accuracy, target:`/${lesson.target_accuracy}%` },
            { label:'Errors', value:result.errors, color:'text-error', met: result.errors < 10, target:'' },
            { label:'Time', value:`${Math.round(result.elapsed)}s`, color:'text-on-surface-variant', met:true, target:'' },
          ].map(s => (
            <div key={s.label} className="grid-box p-4 text-center bg-white/[0.015]">
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30 mb-1.5">{s.label}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              {s.target && (
                <div className={`text-[9px] font-bold mt-1 ${s.met ? 'text-correct' : 'text-error/80'}`}>
                  {s.met ? '✓' : '✗'} {s.target}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weak keys */}
        {topWeakKeys.length > 0 && (
          <div className="grid-box p-5 bg-white/[0.015]">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400/60" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">
                Weak Keys — Focus on these
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topWeakKeys.map(([key, count]) => {
                const finger = KEY_FINGER_MAP[key] || KEY_FINGER_MAP[key.toLowerCase()];
                const color  = finger ? FINGER_COLORS[finger] : '#f87171';
                return (
                  <div key={key} className="grid-box px-3 py-2 flex items-center gap-2"
                    style={{ borderColor:`${color}40`, backgroundColor:`${color}10` }}>
                    <span className="text-sm font-black" style={{ color }}>{key === ' ' ? '␣' : key.toUpperCase()}</span>
                    <span className="text-[9px] font-bold text-on-surface-variant/40">{count}×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={resetToIntro}
            className="grid-box flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 hover:bg-white/5 hover:border-white/20 hover:text-on-surface-variant transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </motion.button>

          {result.passed && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onCompleteRef.current(result)}
              className="grid-box flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] transition-all"
              style={{ borderColor:`${diffColor}55`, backgroundColor:`${diffColor}10`, color: diffColor }}
            >
              Next Lesson <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  // ── TYPING PHASE ───────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-[3px] bg-white/5 flex-shrink-0">
        <motion.div
          className="h-full"
          style={{ backgroundColor: diffColor }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.08 }}
        />
      </div>

      <div className="flex-1 flex flex-col gap-5 p-5 md:p-7 overflow-y-auto">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: diffColor }}>
              L{lesson.level} · {lesson.title}
            </span>
            <div className="flex gap-1 flex-wrap">
              {lesson.keys.slice(0, 8).map(k => {
                const finger = KEY_FINGER_MAP[k] || KEY_FINGER_MAP[k.toLowerCase()];
                const color  = finger ? FINGER_COLORS[finger] : '#666';
                return (
                  <span key={k} className="text-[9px] font-black px-1.5 py-0.5 rounded-sm border"
                    style={{ color, borderColor:`${color}40`, backgroundColor:`${color}10` }}>
                    {k === ' ' ? '␣' : k}
                  </span>
                );
              })}
              {lesson.keys.length > 8 && (
                <span className="text-[9px] font-bold text-on-surface-variant/25">+{lesson.keys.length - 8}</span>
              )}
            </div>
          </div>
          <div className="text-[9px] font-bold text-on-surface-variant/20 uppercase tracking-widest">
            {Math.round(progress * 100)}%
          </div>
        </div>

        {/* Live stats bar */}
        <div className="flex items-center gap-7 flex-shrink-0">
          {[
            { label:'WPM',  value: liveWpm || '—',                       cls:'text-primary' },
            { label:'ACC',  value: liveTotal > 0 ? `${liveAccuracy}%` : '—', cls:'text-correct' },
            { label:'ERR',  value: liveErrors,                             cls:'text-error/70' },
            { label:'TIME', value: startTimeRef.current ? `${Math.floor(elapsed)}s` : '—', cls:'text-on-surface-variant/50' },
          ].map(s => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-[8px] font-black uppercase tracking-[0.45em] text-on-surface-variant/20">{s.label}</span>
              <span className={`text-xl font-black ${s.cls}`}>{s.value}</span>
            </div>
          ))}
          <div className="ml-auto text-[9px] font-bold text-on-surface-variant/15 uppercase tracking-widest">
            ⬛ TARGET: {lesson.target_wpm}wpm · {lesson.target_accuracy}%
          </div>
        </div>

        {/* Text display */}
        <div className="grid-box p-5 md:p-6 bg-black/25 flex-shrink-0 cursor-default">
          <TextDisplay flatText={flatText} typedChars={typedChars} />
        </div>

        {/* Finger hint */}
        <div className="flex-shrink-0">
          <FingerHint targetChar={targetChar} />
        </div>

        {/* Virtual keyboard */}
        <div className="flex justify-center flex-shrink-0 overflow-x-auto no-scrollbar w-full">
          <div className="min-w-fit scale-[0.75] sm:scale-90 md:scale-100 origin-center my-[-10px] sm:my-0">
            <VirtualKeyboard targetChar={targetChar} flashState={flashState} />
          </div>
        </div>

        {/* Hint footer */}
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.35em] text-on-surface-variant/12 flex-shrink-0">
          <span>⌫ Backspace to correct mistakes</span>
          <span className={startTimeRef.current ? '' : 'animate-pulse'}>
            {startTimeRef.current ? `${typedChars.length} / ${flatText.length} chars` : '⬛ Start typing...'}
          </span>
        </div>
      </div>
    </div>
  );
}
