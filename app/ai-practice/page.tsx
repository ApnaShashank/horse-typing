'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Keyboard, Play, RotateCcw, Edit2, Save, Trash2, 
  ChevronRight, Mail, Code, BookOpen, Clock, Target, 
  AlertTriangle, RefreshCw, CheckCircle2, ChevronLeft, Brain, Code2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────
type Generation = {
  id: string;
  prompt: string;
  content: string;
  category: string;
  createdAt: string;
};

type Result = {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
};

// ─── Key Finger Mapping for Highlight Hint ────────────────────────
const KEY_FINGER_MAP: Record<string, string> = {
  '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index',
  '5': 'left-index', '6': 'right-index', '7': 'right-index', '8': 'right-middle',
  '9': 'right-ring', '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',
  'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index',
  't': 'left-index', 'y': 'right-index', 'u': 'right-index', 'i': 'right-middle',
  'o': 'right-ring', 'p': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky',
  'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index',
  'g': 'left-index', 'h': 'right-index', 'j': 'right-index', 'k': 'right-middle',
  'l': 'right-ring', ';': 'right-pinky', "'": 'right-pinky',
  'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index',
  'b': 'left-index', 'n': 'right-index', 'm': 'right-index', ',': 'right-middle',
  '.': 'right-ring', '/': 'right-pinky', ' ': 'thumb',
};

const FINGER_COLORS: Record<string, string> = {
  'left-pinky':   '#818cf8',
  'left-ring':    '#60a5fa',
  'left-middle':  '#34d399',
  'left-index':   '#4ade80',
  'right-index':  '#facc15',
  'right-middle': '#fb923c',
  'right-ring':   '#f87171',
  'right-pinky':  '#e879f9',
  'thumb':        '#94a3b8',
};

const FINGER_NAMES: Record<string, string> = {
  'left-pinky':   'L. Pinky',
  'left-ring':    'L. Ring',
  'left-middle':  'L. Middle',
  'left-index':   'L. Index',
  'right-index':  'R. Index',
  'right-middle': 'R. Middle',
  'right-ring':   'R. Ring',
  'right-pinky':  'R. Pinky',
  'thumb':        'Thumb',
};

function getFingerForChar(char: string): string | null {
  if (!char) return null;
  const lower = char.toLowerCase();
  return KEY_FINGER_MAP[lower] || null;
}

// ─── Word Presets ─────────────────────────────────────────────────
const PRESETS = [
  {
    label: 'Resignation Mail',
    prompt: 'Write a formal resignation email to my manager due to personal reasons.',
    category: 'email',
    icon: <Mail className="w-3.5 h-3.5" />,
  },
  {
    label: 'Python Bubble Sort',
    prompt: 'Create a simple Python function to perform bubble sort on an array.',
    category: 'code',
    icon: <Code className="w-3.5 h-3.5" />,
  },
  {
    label: 'React Hook',
    prompt: 'Write a custom React hook in TypeScript to fetch data from an API.',
    category: 'code',
    icon: <Code2 className="w-3.5 h-3.5" />,
  },
  {
    label: 'Creative Short Story',
    prompt: 'Write a mysterious short paragraph about an ancient key found in a desert.',
    category: 'creative',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    label: 'SQL Table Join',
    prompt: 'Write an SQL query joining users and transactions to find total spend per user.',
    category: 'code',
    icon: <Code className="w-3.5 h-3.5" />,
  },
];

// ─── Difficulty Evaluator ──────────────────────────────────────────
function evaluateDifficulty(text: string): { label: string; color: string } {
  if (!text) return { label: 'Unknown', color: 'text-on-surface-variant' };
  
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  const symbolCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const totalLength = text.length;
  
  const symbolDensity = symbolCount / totalLength;
  const upperDensity = uppercaseCount / totalLength;
  
  if (symbolDensity > 0.08 || text.includes('{') || text.includes('}')) {
    return { label: 'Developer Level', color: '#f87171' }; // red
  } else if (symbolDensity > 0.03 || upperDensity > 0.05) {
    return { label: 'Intermediate', color: '#facc15' }; // yellow
  }
  return { label: 'Easy', color: '#4ade80' }; // green
}

// ─── Text Display component ────────────────────────────────────────
const TextDisplay = memo(({ flatText, typedChars }: { flatText: string; typedChars: string }) => {
  return (
    <div className="font-mono text-base md:text-lg leading-[2.2] tracking-wide select-none break-words whitespace-pre-wrap">
      {flatText.split('').map((char, i) => {
        const typed   = i < typedChars.length;
        const isCur   = i === typedChars.length;
        const correct = typed && typedChars[i] === char;
        const wrong   = typed && typedChars[i] !== char;

        return (
          <span
            key={i}
            className={`relative transition-none
              ${correct ? 'text-correct' : ''}
              ${wrong   ? 'text-error bg-error/15 rounded-sm' : ''}
              ${!typed && !isCur ? 'text-on-surface-variant/25' : ''}
              ${isCur   ? 'text-on-surface underline decoration-primary decoration-2 underline-offset-4' : ''}
            `}
          >
            {isCur && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
                className="absolute left-0 top-[3px] bottom-[3px] w-[2.5px] bg-primary rounded-full"
              />
            )}
            {char === '\n' ? (
              <>
                <span className="text-on-surface-variant/15 font-sans inline-block select-none pointer-events-none">↵</span>
                <br />
              </>
            ) : char === ' ' ? (
              '\u00A0'
            ) : (
              char
            )}
          </span>
        );
      })}
    </div>
  );
});
TextDisplay.displayName = 'TextDisplay';

// ─── Virtual Keyboard Component ──────────────────────────────────
const VirtualKeyboard = memo(({ targetChar }: { targetChar: string }) => {
  const finger = getFingerForChar(targetChar);
  const color = finger ? FINGER_COLORS[finger] : '#444';
  const name = finger ? FINGER_NAMES[finger] : 'Unknown';

  if (!targetChar) return null;

  return (
    <div className="flex items-center gap-3 bg-surface-container-low border border-white/5 p-3 rounded-xl max-w-sm">
      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}88` }} />
      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
        Next key: <kbd className="bg-surface-container-highest px-2 py-1 rounded border border-white/10 text-on-surface text-xs font-mono select-none">{targetChar === ' ' ? 'Space' : targetChar === '\n' ? 'Enter' : targetChar}</kbd>
      </span>
      <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/35 font-sans">
        ({name})
      </span>
    </div>
  );
});
VirtualKeyboard.displayName = 'VirtualKeyboard';

// ─── Main AI Practice Page ───────────────────────────────────────
export default function AIPractice() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState<Generation[]>([]);
  const [activeGeneration, setActiveGeneration] = useState<Generation | null>(null);

  // Custom editor
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Typing engine states
  const [typedChars, setTypedChars] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [testResult, setTestResult] = useState<Result | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch recent generations
  const fetchRecents = async () => {
    try {
      const res = await fetch('/api/ai-generate');
      if (res.ok) {
        const data = await res.json();
        setRecents(data.recents || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecents();
  }, []);

  // Timer loop
  useEffect(() => {
    if (startTime && !testResult) {
      timerRef.current = setInterval(() => {
        setElapsed((performance.now() - startTime) / 1000);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, testResult]);

  // Handle generation request
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    resetEngine();

    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), category }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveGeneration(data.generation);
        fetchRecents(); // Refresh sidebar list
      } else {
        alert('Failed to generate text. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to the generation service.');
    } finally {
      setLoading(false);
    }
  };

  // Reset engine
  const resetEngine = () => {
    setTypedChars('');
    setStartTime(null);
    setElapsed(0);
    setErrors(0);
    setTestResult(null);
    setIsEditing(false);
  };

  // Load target text (e.g. from history feed)
  const handleLoadGeneration = (gen: Generation) => {
    setActiveGeneration(gen);
    setPrompt(gen.prompt);
    setCategory(gen.category);
    resetEngine();
  };

  // Key handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeGeneration || isEditing || testResult) return;

    // Disallow keyboard triggers if prompt textarea is focused
    if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
      return;
    }

    const textToType = activeGeneration.content;
    const currentLength = typedChars.length;
    const targetChar = textToType[currentLength];

    if (!targetChar) return;

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(performance.now());
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      setTypedChars(prev => prev.slice(0, -1));
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }

    // Ignore modifier keys
    if (e.key.length !== 1 && e.key !== 'Enter') return;

    // Check key
    const typedKey = e.key === 'Enter' ? '\n' : e.key;

    if (typedKey === targetChar) {
      const nextTyped = typedChars + typedKey;
      setTypedChars(nextTyped);

      // Check finish
      if (nextTyped.length >= textToType.length) {
        const finalTime = (performance.now() - (startTime || performance.now())) / 1000 || 1;
        const correct = textToType.length;
        const wpmVal = Math.round((correct / 5) / (finalTime / 60));
        const totalKeystrokes = correct + errors;
        const accVal = totalKeystrokes > 0 ? Math.round((correct / totalKeystrokes) * 100) : 100;

        setTestResult({
          wpm: wpmVal,
          accuracy: accVal,
          errors: errors,
          time: finalTime,
        });
      }
    } else {
      setErrors(prev => prev + 1);
    }
  }, [activeGeneration, typedChars, startTime, errors, isEditing, testResult]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Derived stats
  const liveCorrect = typedChars.length;
  const liveTotal = liveCorrect + errors;
  const liveWpm = (elapsed > 0)
    ? Math.max(0, Math.round((liveCorrect / 5) / (elapsed / 60)))
    : 0;
  const liveAccuracy = liveTotal > 0
    ? Math.round((liveCorrect / liveTotal) * 100)
    : 100;

  const targetChar = activeGeneration?.content[typedChars.length] || '';
  const diffInfo = useMemo(() => evaluateDifficulty(activeGeneration?.content || ''), [activeGeneration]);

  // Custom text save handler
  const saveEditedText = () => {
    if (activeGeneration) {
      setActiveGeneration({
        ...activeGeneration,
        content: editText,
      });
      setIsEditing(false);
      resetEngine();
    }
  };

  // Preset click
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setPrompt(preset.prompt);
    setCategory(preset.category);
  };

  // AI Coach Commentary generator
  const coachCommentary = useMemo(() => {
    if (!activeGeneration) return '';
    const length = activeGeneration.content.length;
    const cat = activeGeneration.category;
    
    if (cat === 'code') {
      return "This is programming code. Pay close attention to standard indentation spaces, curly braces, and symbols. Perfect for training your pinky finger stretch!";
    }
    if (length > 400) {
      return "This text is quite lengthy. Focus on speed stability and maintaining a steady breathing rhythm rather than sudden bursts.";
    }
    return "This paragraph is relatively short and clean. Try to aim for a perfect 100% accuracy run here!";
  }, [activeGeneration]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] mt-14 overflow-hidden font-mono text-on-surface bg-background">
      
      {/* ── Left Section: Practice / Type Space ── */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-6 lg:p-10 relative">
        <div className="max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="grid-box p-2.5 bg-primary/5 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-on-surface">AI Typing Practice</h1>
              <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                Generate custom paragraphs, edit details, and practice keys
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeGeneration ? (
              // Prompt Setup Form
              <motion.div
                key="prompt-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid-box p-6 bg-surface-container-low border border-white/5 space-y-5 rounded-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.01] pointer-events-none">
                  <Brain className="w-48 h-48" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    What would you like to practice today?
                  </h3>
                  <p className="text-[10px] text-on-surface-variant/35 uppercase tracking-wide">
                    Input a request or click a quick preset on the side panel
                  </p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Enter Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Write a resignation letter to company, or write a bubble sort code in JavaScript..."
                      rows={3}
                      className="w-full bg-black/35 border border-white/8 rounded-xl p-4 text-xs font-sans text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/45 transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Category:</span>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-surface-container-highest border border-white/8 text-[10px] font-black uppercase tracking-wider text-on-surface rounded px-3 py-1.5 focus:outline-none"
                      >
                        <option value="general">General Paragraph</option>
                        <option value="email">Email Draft</option>
                        <option value="code">Source Code</option>
                        <option value="creative">Creative Writing</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        loading || !prompt.trim()
                          ? 'bg-primary/10 text-primary cursor-not-allowed border border-primary/20'
                          : 'bg-primary text-background hover:bg-primary/95 hover:scale-[1.02]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate Practice Text
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : testResult ? (
              // Results Display Card
              <motion.div
                key="result-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid-box p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <CheckCircle2 className="w-16 h-16 text-correct drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-correct">Practice Complete!</h2>
                  <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
                    AI generated paragraph successfully completed
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'WPM', value: testResult.wpm, cls: 'text-primary' },
                    { label: 'Accuracy', value: `${testResult.accuracy}%`, cls: 'text-correct' },
                    { label: 'Errors', value: testResult.errors, cls: 'text-error' },
                    { label: 'Time Spent', value: `${Math.round(testResult.time)}s`, cls: 'text-on-surface-variant/60' },
                  ].map(s => (
                    <div key={s.label} className="grid-box p-4 text-center bg-white/[0.015]">
                      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30 mb-1">{s.label}</div>
                      <div className={`text-2xl font-black ${s.cls}`}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                    onClick={resetEngine}
                    className="grid-box flex-1 py-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                    onClick={() => setActiveGeneration(null)}
                    className="grid-box flex-1 py-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 border-primary/30 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" /> Create Another
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              // Active Practice Screen
              <motion.div
                key="active-practice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Control bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 grid-box p-3 bg-white/[0.01]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => setActiveGeneration(null)}
                      className="p-1.5 hover:bg-white/5 rounded-md border border-white/5 hover:border-white/10 transition-all cursor-pointer flex-shrink-0"
                      title="Back to prompt setup"
                    >
                      <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
                    </button>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary/70 line-clamp-1">Prompt: {activeGeneration.prompt}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${diffInfo.color}15`, color: diffInfo.color }}>
                          {diffInfo.label}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-white/5 text-on-surface-variant/50 px-1.5 py-0.5 rounded-sm">
                          {activeGeneration.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right options: edit & generate another */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          saveEditedText();
                        } else {
                          setEditText(activeGeneration.content);
                          setIsEditing(true);
                        }
                      }}
                      className="px-3 py-1.5 rounded border border-white/8 hover:border-white/15 bg-white/3 hover:bg-white/6 transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-on-surface-variant hover:text-on-surface"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-3.5 h-3.5 text-correct" />
                          Save Text
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Text
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleGenerate()}
                      className="px-3 py-1.5 rounded border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Create Another
                    </button>
                  </div>
                </div>

                {/* Main typing container */}
                <div className="grid-box p-6 bg-black/25 relative overflow-hidden min-h-[180px] flex items-center">
                  {isEditing ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={6}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary/50"
                    />
                  ) : (
                    <TextDisplay flatText={activeGeneration.content} typedChars={typedChars} />
                  )}
                </div>

                {/* Live Stats bar */}
                {!isEditing && (
                  <div className="flex items-center gap-6 grid-box p-3 bg-white/[0.005]">
                    {[
                      { label: 'WPM', value: liveWpm || '—', cls: 'text-primary' },
                      { label: 'ACC', value: liveTotal > 0 ? `${liveAccuracy}%` : '—', cls: 'text-correct' },
                      { label: 'ERR', value: errors, cls: 'text-error/70' },
                      { label: 'TIME', value: startTime ? `${Math.floor(elapsed)}s` : '—', cls: 'text-on-surface-variant/45' },
                    ].map(s => (
                      <div key={s.label} className="flex items-baseline gap-1.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/20">{s.label}</span>
                        <span className={`text-lg font-black ${s.cls}`}>{s.value}</span>
                      </div>
                    ))}
                    <button
                      onClick={resetEngine}
                      className="ml-auto p-1.5 hover:bg-white/5 rounded border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                      title="Restart Practice"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-on-surface-variant" />
                    </button>
                  </div>
                )}

                {/* Keyboard Helper & Coach */}
                {!isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <VirtualKeyboard targetChar={targetChar} />
                    
                    {/* Coach commentary */}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex items-start gap-3">
                      <Brain className="w-5 h-5 text-primary/75 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">AI Coach Advice</span>
                        <p className="text-[10px] font-medium leading-relaxed text-on-surface-variant/80 font-sans italic">
                          &ldquo;{coachCommentary}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* ── Right Section: Sidebar (Presets & Recent Global Feed) ── */}
      <aside className="hidden md:flex flex-col w-[320px] flex-shrink-0 border-l border-white/5 bg-surface-container-low overflow-hidden">
        
        {/* Presets Header */}
        <div className="p-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Prompt Presets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="px-2.5 py-1.5 rounded bg-white/4 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all text-[9px] font-bold text-on-surface-variant/75 hover:text-on-surface flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {preset.icon}
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Recent Feed */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Global Feed</span>
            </div>
            <span className="text-[8px] font-black text-on-surface-variant/35 uppercase tracking-wide">
              Recent generations
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5">
            {recents.length > 0 ? (
              recents.map((item) => {
                const itemDiff = evaluateDifficulty(item.content);
                const isCode = item.category === 'code';
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleLoadGeneration(item)}
                    className="grid-box p-3 bg-white/[0.005] hover:bg-primary/[0.02] border-white/5 hover:border-primary/20 transition-all cursor-pointer group flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                        {item.prompt}
                      </span>
                      <div className="shrink-0 text-on-surface-variant/30 group-hover:text-primary/55 transition-colors">
                        {isCode ? <Code className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-1.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: itemDiff.color }}>
                        {itemDiff.label}
                      </span>
                      <span className="text-[8px] font-bold text-on-surface-variant/30">
                        {item.content.length} chars
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 space-y-2">
                <Brain className="w-6 h-6 text-on-surface-variant/15 mx-auto" />
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/25 italic">
                  No generations found
                </p>
              </div>
            )}
          </div>
        </div>

      </aside>

    </div>
  );
}
