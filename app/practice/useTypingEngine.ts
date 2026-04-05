import { useState, useEffect, useRef, useCallback } from 'react';
import { generateText, GenerationOptions } from './words';

export type TypingStatus = 'idle' | 'running' | 'finished' | 'loading';

export type WpmPoint = {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
};

export function useTypingEngine(defaultOptions: GenerationOptions, onFinish?: (stats: any) => void) {
  const [options, setOptions] = useState<GenerationOptions>(defaultOptions);
  const [status, setStatus] = useState<TypingStatus>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [typedHistory, setTypedHistory] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState<string>('');
  
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<WpmPoint[]>([]);
  const [weakKeysMap, setWeakKeysMap] = useState<Record<string, number>>({});
  
  const [errorsThisSecond, setErrorsThisSecond] = useState(0);

  // High-precision references
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const calculateDetailedStats = useCallback((history: string[], currentInput: string, elapsed: number) => {
    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let missedChars = 0;

    for (let i = 0; i < words.length; i++) {
      const target = words[i];
      const typed = i < history.length ? history[i] : (i === history.length ? currentInput : undefined);
      
      if (typed === undefined) continue;

      if (i < history.length) {
        for (let j = 0; j < Math.max(target.length, typed.length); j++) {
          if (j < target.length) {
            if (typed[j] === undefined) missedChars++;
            else if (typed[j] === target[j]) correctChars++;
            else incorrectChars++;
          } else {
            extraChars++;
          }
        }
        correctChars++; 
      } else {
        for (let j = 0; j < typed.length; j++) {
           if (j < target.length) {
             if (typed[j] === target[j]) correctChars++;
             else incorrectChars++;
           } else {
             extraChars++;
           }
        }
      }
    }

    const timeSec = Math.max(elapsed, 1);
    const wpm = Math.round((correctChars / 5) / (timeSec / 60));
    const raw = Math.round(((correctChars + incorrectChars + extraChars) / 5) / (timeSec / 60));
    const accuracy = (correctChars + incorrectChars + extraChars) > 0 
      ? Math.round((correctChars / (correctChars + incorrectChars + extraChars)) * 100) 
      : 100;

    return { wpm, raw, accuracy, correctChars, incorrectChars, extraChars, missedChars };
  }, [words]);

  const finishTest = useCallback((finalElapsed: number) => {
    if (status === 'finished') return;
    setStatus('finished');
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    
    if (onFinish) {
      const stats = calculateDetailedStats(typedHistory, currentWordInput, finalElapsed);
      const wpms = wpmHistory.map(h => h.wpm);
      const avgWpm = wpms.length > 0 ? wpms.reduce((a, b) => a + b, 0) / wpms.length : stats.wpm;
      const variance = wpms.length > 0 ? wpms.map(x => Math.pow(x - avgWpm, 2)).reduce((a, b) => a + b, 0) / wpms.length : 0;
      const consistency = Math.max(0, Math.round(100 - (Math.sqrt(variance) / (avgWpm || 1) * 100)));

      onFinish({
        ...stats,
        consistency,
        mode: options.mode,
        duration: finalElapsed,
        wordCount: options.wordCount,
        weakKeys: weakKeysMap,
        wpmHistory
      });
    }
  }, [status, onFinish, calculateDetailedStats, typedHistory, currentWordInput, options, weakKeysMap, wpmHistory]);

  const initializeEngine = useCallback(async (opts: GenerationOptions = options) => {
    setStatus('loading');
    setOptions(opts);

    let newWords: string[] = [];
    if (opts.mode === 'custom') {
      newWords = (opts.customText?.trim() || 'custom').split(opts.delimiter === 'pipe' ? '|' : ' ').filter(Boolean);
      if (opts.shuffle) newWords.sort(() => Math.random() - 0.5);
    } else {
      try {
        const queryParams = new URLSearchParams({
           mode: opts.mode,
           count: (opts.wordCount || (opts.mode === 'time' ? 100 : 50)).toString(),
           punctuation: (opts.punctuation || false).toString(),
           numbers: (opts.numbers || false).toString()
        });
        const res = await fetch(`/api/text?${queryParams}`);
        if(res.ok) {
           const data = await res.json();
           newWords = data.words;
        } else {
           newWords = ['typing', 'precision', 'engine', 'ready'];
        }
      } catch (e) {
        newWords = ['offline', 'mode', 'active'];
      }
    }

    setWords(newWords);
    setTypedHistory([]);
    setCurrentWordInput('');
    setTimeElapsed(0);
    setWpmHistory([]);
    setWeakKeysMap({});
    setErrorsThisSecond(0);
    setTimeRemaining(opts.mode === 'time' ? (opts.wordCount || 15) : 0);
    setStatus('idle');
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, [options]);

  useEffect(() => {
    initializeEngine();
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, []);

  // Refs to avoid timer resets on keystroke updates
  const typedHistoryRef = useRef<string[]>([]);
  const currentWordInputRef = useRef<string>('');
  const errorsThisSecondRef = useRef<number>(0);
  const lastSecondRef = useRef<number>(0);
  const isFetchingMoreRef = useRef<boolean>(false);

  useEffect(() => {
    typedHistoryRef.current = typedHistory;
  }, [typedHistory]);

  useEffect(() => {
    currentWordInputRef.current = currentWordInput;
  }, [currentWordInput]);

  useEffect(() => {
    errorsThisSecondRef.current = errorsThisSecond;
  }, [errorsThisSecond]);

  const fetchMoreWords = useCallback(async () => {
    if (isFetchingMoreRef.current) return;
    isFetchingMoreRef.current = true;
    try {
      const queryParams = new URLSearchParams({
        mode: options.mode,
        count: '50',
        punctuation: (options.punctuation || false).toString(),
        numbers: (options.numbers || false).toString()
      });
      const res = await fetch(`/api/text?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setWords(prev => [...prev, ...data.words]);
      }
    } catch (e) {
      console.error('Failed to fetch more words:', e);
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [options]);

  // Performance-based Timer Loop
  useEffect(() => {
    if (status === 'running') {
      // Only set start time once per running session
      if (startTimeRef.current === 0) {
        startTimeRef.current = performance.now();
        lastSecondRef.current = 0;
      }

      const tick = (now: number) => {
        const elapsed = (now - startTimeRef.current) / 1000;
        const currentSecond = Math.floor(elapsed);

        // Update real-time counters
        if (currentSecond > lastSecondRef.current) {
          lastSecondRef.current = currentSecond;
          
          setTimeElapsed(currentSecond);
          
          if (options.mode === 'time') {
            const totalDuration = options.wordCount || 15;
            const remaining = Math.max(0, totalDuration - currentSecond);
            setTimeRemaining(remaining);
            if (remaining <= 0) {
              finishTest(currentSecond);
              return;
            }
          }

          setWpmHistory(prev => {
            const stats = calculateDetailedStats(typedHistoryRef.current, currentWordInputRef.current, currentSecond);
            return [...prev, { 
              time: currentSecond, 
              wpm: stats.wpm, 
              raw: stats.raw, 
              errors: errorsThisSecondRef.current 
            }];
          });
          setErrorsThisSecond(0);
        }

        timerRef.current = requestAnimationFrame(tick);
      };

      timerRef.current = requestAnimationFrame(tick);
    } else if (status === 'idle') {
      startTimeRef.current = 0;
      lastSecondRef.current = 0;
    }
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [status, options.mode, options.wordCount, finishTest, calculateDetailedStats]);

  const handleTyping = (value: string) => {
    if (status === 'finished') return;
    if (status === 'idle') setStatus('running');

    const activeWordIndex = typedHistory.length;
    const targetWord = words[activeWordIndex];

    // Replenish words if running low in time mode
    if (options.mode === 'time' && activeWordIndex > words.length - 10) {
      fetchMoreWords();
    }

    if (value.endsWith(' ')) {
      setTypedHistory(prev => [...prev, value.trim()]);
      setCurrentWordInput('');
      if ((options.mode === 'words' || options.mode === 'quote' || options.mode === 'custom') && activeWordIndex + 1 === words.length) {
        finishTest(timeElapsed);
      }
      return;
    }

    if (value.length > currentWordInput.length) {
      const charIndex = value.length - 1;
      if (targetWord && charIndex < targetWord.length) {
        if (value[charIndex] !== targetWord[charIndex]) {
          setWeakKeysMap(prev => ({ ...prev, [targetWord[charIndex]]: (prev[targetWord[charIndex]] || 0) + 1 }));
          setErrorsThisSecond(prev => prev + 1);
        }
      } else if (targetWord && charIndex >= targetWord.length) {
         setErrorsThisSecond(prev => prev + 1);
      }
    }

    setCurrentWordInput(value);
  };

  const currentStats = calculateDetailedStats(typedHistory, currentWordInput, timeElapsed);
  const wpms = wpmHistory.map(h => h.wpm);
  const avgWpm = wpms.length > 0 ? wpms.reduce((a, b) => a + b, 0) / wpms.length : currentStats.wpm;
  const variance = wpms.length > 0 ? wpms.map(x => Math.pow(x - avgWpm, 2)).reduce((a, b) => a + b, 0) / wpms.length : 0;
  const consistency = Math.max(0, Math.round(100 - (Math.sqrt(variance) / (avgWpm || 1) * 100)));

  return {
    status,
    words,
    typedHistory,
    currentWordInput,
    activeWordIndex: typedHistory.length,
    timeRemaining,
    timeElapsed,
    ...currentStats,
    consistency,
    options,
    wpmHistory,
    handleTyping,
    initializeEngine,
    setOptions,
    finishTest: () => finishTest(timeElapsed)
  };
}
