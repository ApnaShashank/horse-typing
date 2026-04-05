'use client';

import { useState, useRef, useEffect, useLayoutEffect, useMemo, memo, useCallback } from 'react';
import { useTypingEngine, WpmPoint } from './useTypingEngine';
import { GenerationOptions } from './words';
import { 
  Clock, Type, Quote, Mountain, Wrench, X, Play, RotateCcw, Settings2, MousePointer2, ChevronRight, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// Memoized Word Component - Fixed structure to prevent blinking
const Word = memo(({ target, typed, isCurrent, input }: { target: string, typed?: string, isCurrent: boolean, input: string }) => {
  return (
    <span className={`${isCurrent ? 'active-word' : ''} mx-[0.3em] my-1 inline-block relative font-mono transition-none`}>
      {target.split('').map((char, i) => {
        const typedChar = isCurrent ? input[i] : (typed ? typed[i] : undefined);
        let charColor = 'text-on-surface-variant/30';
        
        if (typedChar !== undefined) {
          charColor = typedChar === char ? 'text-correct' : 'text-error bg-error/10';
        }
        
        return <span key={i} className={`char ${charColor}`}>{char}</span>;
      })}
      
      {/* Handle extra characters typed beyond the word length */}
      {isCurrent && input.length > target.length && input.slice(target.length).split('').map((char, i) => (
        <span key={i} className="char text-error bg-error/20">{char}</span>
      ))}
      
      {/* Show extra characters even after word is finished if they were typed */}
      {!isCurrent && typed && typed.length > target.length && typed.slice(target.length).split('').map((char, i) => (
        <span key={i} className="char text-error/50 bg-error/5">{char}</span>
      ))}
    </span>
  );
});

Word.displayName = 'Word';

export default function Practice() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  
  const [customText, setCustomText] = useState('');
  const [customDelimiter, setCustomDelimiter] = useState('space');
  const [customLimit, setCustomLimit] = useState(50);
  const [customShuffle, setCustomShuffle] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.authenticated) setUser(data.user);
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
          mistakes: stats.incorrectChars + stats.extraChars,
          rawSpeed: stats.raw,
          weakKeys: stats.weakKeys
        })
      });
    } catch (e) { console.error('Error saving result:', e); }
  };

  const {
    status, words, typedHistory, currentWordInput, activeWordIndex,
    timeRemaining, timeElapsed, wpm, raw, accuracy,
    correctChars, incorrectChars, extraChars, missedChars, consistency,
    options, wpmHistory, handleTyping, initializeEngine
  } = useTypingEngine({
    mode: 'time',
    language: 'english',
    punctuation: false,
    numbers: false,
    wordCount: 15,
  }, handleTestFinish);

  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const [isWordJump, setIsWordJump] = useState(false);
  const [lineOffset, setLineOffset] = useState(0);
  const [isFocused, setIsFocused] = useState(true);

  // Track previous word index to detect jumps
  const prevWordIndex = useRef(0);

  useLayoutEffect(() => {
    if (status === 'finished') return;
    
    const container = wordsContainerRef.current;
    if (!container) return;

    const activeSpan = container.querySelector('.active-word') as HTMLElement;

    if (activeSpan) {
      const charSpans = activeSpan.querySelectorAll('.char');
      const currentCharSpan = charSpans[currentWordInput.length] as HTMLElement;
      
      let x = activeSpan.offsetLeft;
      let y = activeSpan.offsetTop + 6;

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

      const lineHeight = 44; 
      if (activeSpan.offsetTop > lineHeight * 3) {
        setLineOffset(activeSpan.offsetTop - lineHeight * 2.5);
      } else {
        setLineOffset(0);
      }
    }
  }, [currentWordInput, activeWordIndex, status, words]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(p => !p);
      if (e.key === 'Tab') { e.preventDefault(); initializeEngine(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initializeEngine]);

  const handleModeChange = (mode: GenerationOptions['mode']) => {
    const newOptions = { ...options, mode };
    initializeEngine(newOptions);
  };

  const startCustomMode = () => {
    initializeEngine({ ...options, mode: 'custom', customText, delimiter: customDelimiter, wordCount: customLimit, shuffle: customShuffle });
    setIsSidebarOpen(false);
  };

  const graphPath = useMemo(() => {
    if (!wpmHistory?.length) return { wpm: '', raw: '', errors: [] };
    const maxVal = Math.max(...wpmHistory.map(h => Math.max(h.wpm, h.raw, 40)));
    const width = 1000, height = 200;
    const scaleX = width / Math.max(wpmHistory.length - 1, 1), scaleY = height / maxVal;
    return { 
      wpm: `M ${wpmHistory.map((h, i) => `${i * scaleX},${height - (h.wpm * scaleY)}`).join(' L ')}`, 
      raw: `M ${wpmHistory.map((h, i) => `${i * scaleX},${height - (h.raw * scaleY)}`).join(' L ')}`,
      errors: wpmHistory.map((h, i) => ({ x: i * scaleX, y: height - (h.wpm * scaleY), count: h.errors })).filter(e => e.count > 0)
    };
  }, [wpmHistory]);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] mt-16 flex flex-col font-mono text-on-surface overflow-hidden relative selection:bg-white/10">
      {/* Sidebar for Custom Mode */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-surface-container-low border-l border-white/5 z-[100] transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Custom Engine</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-sm transition-colors text-on-surface-variant"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 space-y-10">
            <div className="space-y-5">
              <label className="text-[12px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Input Text</label>
              <textarea className="w-full h-48 bg-black/20 border border-white/5 rounded-sm p-5 text-xs text-on-surface focus:border-primary/30 outline-none transition-colors resize-none font-mono leading-relaxed" placeholder="Paste your custom text here..." value={customText} onChange={(e) => setCustomText(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-3"><label className="text-[12px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Limit</label><input className="w-full bg-black/20 border border-white/5 rounded-sm p-3 text-xs text-on-surface outline-none" type="number" value={customLimit} onChange={(e) => setCustomLimit(parseInt(e.target.value) || 0)} /></div>
               <div className="space-y-3"><label className="text-[12px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Shuffle</label><button onClick={()=>setCustomShuffle(!customShuffle)} className={`w-full py-3 rounded-sm text-[11px] font-bold transition-colors ${customShuffle?'bg-primary/10 text-primary border border-primary/20':'border border-white/5 text-on-surface-variant/40'}`}>{customShuffle?'ACTIVE':'OFF'}</button></div>
            </div>
            <button onClick={startCustomMode} className="w-full bg-primary/10 border border-primary/20 text-primary font-bold rounded-sm py-4 text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-3"><Play className="w-3.5 h-3.5 fill-current" /> Apply Configuration</button>
          </div>
        </div>
      </aside>

      {/* Main Control Bar (Grid Aligned) */}
      <div className="w-full border-b border-white/5 bg-background/30 backdrop-blur-md z-40">
        <div className="max-w-[1250px] mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-10 text-[12px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
              <div className="flex gap-6 border-r border-white/5 pr-10">
                <button onClick={() => initializeEngine({ ...options, punctuation: !options.punctuation })} className={`hover:text-on-surface transition-colors ${options.punctuation ? 'text-primary' : ''}`}>@ Punc</button>
                <button onClick={() => initializeEngine({ ...options, numbers: !options.numbers })} className={`hover:text-on-surface transition-colors ${options.numbers ? 'text-primary' : ''}`}># Num</button>
              </div>
              <div className="flex gap-8 border-r border-white/5 pr-10">
                {[{id:'time',icon:<Clock className="w-4 h-4"/>},{id:'words',icon:<Type className="w-4 h-4"/>},{id:'quote',icon:<Quote className="w-4 h-4"/>},{id:'zen',icon:<Mountain className="w-4 h-4"/>},{id:'custom',icon:<Wrench className="w-4 h-4"/>}].map(m=>(<button key={m.id} onClick={()=>handleModeChange(m.id as any)} className={`transition-colors flex items-center gap-3 ${options.mode===m.id?'text-primary':'hover:text-on-surface'}`}>{m.icon}{m.id}</button>))}
              </div>
              <div className="flex gap-6">
                {['time','words'].includes(options.mode)&&[15,30,60,120].map(v=>(<button key={v} onClick={()=>initializeEngine({...options,wordCount:v})} className={`transition-all ${options.wordCount===v?'text-primary font-black':'hover:text-on-surface'}`}>{v}</button>))}
                {options.mode==='custom'&&<button onClick={() => setIsSidebarOpen(true)} className="hover:text-on-surface flex items-center gap-2"><Settings2 className="w-4 h-4"/> CONFIG</button>}
              </div>
           </div>
           
           {status === 'running' && (
             <div className="flex items-center gap-4 text-xs font-bold text-primary/40">
               <span className="animate-pulse">PROCESSED: {activeWordIndex}</span>
               <span className="w-1 h-1 rounded-full bg-white/10" />
               <span>{options.mode==='time'?`${timeRemaining}s`:`${timeElapsed}s`}</span>
             </div>
           )}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <div className="w-full max-w-5xl">
          {status==='loading' ? (
            <div className="h-[200px] flex items-center justify-center"><div className="flex gap-3"><div className="w-1 h-3 bg-primary/40 animate-pulse"></div><div className="w-1 h-6 bg-primary/60 animate-pulse delay-75"></div><div className="w-1 h-3 bg-primary/40 animate-pulse delay-150"></div></div></div>
          ) : status === 'finished' ? (
             <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-16 mb-20">
                   <div className="grid-box p-12 space-y-16">
                     <div><div className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] mb-6">Words Per Min</div><div className="text-9xl font-black text-primary tracking-tighter leading-none">{wpm}</div></div>
                     <div><div className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] mb-6">Accuracy</div><div className="text-9xl font-black text-primary tracking-tighter leading-none">{accuracy}%</div></div>
                   </div>
                   <div className="grid-box p-12 relative flex flex-col">
                      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6"><span className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em]">Performance Graph</span><span className="text-[11px] font-bold text-primary/40 uppercase tracking-[0.1em]">{options.mode} test</span></div>
                      <div className="flex-1 relative">
                        <div className="absolute left-[-25px] h-full flex flex-col justify-between text-[10px] font-bold text-on-surface-variant/20 uppercase"><span>{Math.max(...wpmHistory.map(h=>Math.max(h.wpm,h.raw,40)))}</span><span>0</span></div>
                        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d={graphPath.raw} fill="none" stroke="#222222" strokeWidth="1" strokeLinejoin="round"/><path d={graphPath.wpm} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinejoin="round" />{graphPath.errors.map((e,i)=>(<circle key={i} cx={e.x} cy={e.y} r="3" fill="#ff5252" />))}</svg>
                        <div className="absolute bottom-[-25px] w-full flex justify-between text-[10px] font-bold text-on-surface-variant/20 uppercase"><span>START</span><span>{timeElapsed}s MARK</span></div>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                   {[ {l:'raw wpm',v:raw}, {l:'characters',v:`${correctChars}/${incorrectChars}/${extraChars}`}, {l:'consistency',v:`${consistency}%`}, {l:'time',v:`${timeElapsed}s`} ].map(s=>(
                     <div key={s.l} className="grid-box p-8"><div className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] mb-3">{s.l}</div><div className="text-3xl font-black text-on-surface-variant/80">{s.v}</div></div>
                   ))}
                </div>

                <div className="flex justify-center gap-10">
                   <button onClick={()=>initializeEngine()} className="grid-box px-16 py-5 text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-primary/5 hover:border-primary/40 transition-all">Next Test</button>
                   <button onClick={()=>initializeEngine(options)} className="grid-box px-16 py-5 text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-primary/5 hover:border-primary/40 transition-all text-on-surface-variant">Retry</button>
                </div>
             </div>
          ) : (
            <div className="relative w-full cursor-text" onClick={()=>{hiddenInputRef.current?.focus();setIsFocused(true);}} onBlur={()=>setIsFocused(false)}>
              <input ref={hiddenInputRef} type="text" className="absolute opacity-0 -z-10 w-1 h-1 pointer-events-none" value={currentWordInput} onChange={(e)=>handleTyping(e.target.value)} onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)} autoFocus autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck="false" />
              
              <div className="relative w-full overflow-hidden h-[184px]">
                <div ref={wordsContainerRef} className={`absolute top-0 left-0 w-full text-[32px] md:text-[36px] flex flex-wrap content-start select-none transition-all duration-300 ${!isFocused?'opacity-5 blur-[2px]':''}`} style={{ transform: `translateY(-${lineOffset}px)` }}>
                  {isFocused && (
                    <div className={`caret ${status==='running'?'':'caret-blink'} ${isWordJump?'caret-instant':''}`} style={{ height: '36px', transform: `translate(${caretPos.x}px, ${caretPos.y}px)`, transition: isWordJump ? 'none' : 'transform 0.1s cubic-bezier(0.19, 1, 0.22, 1)' }} />
                  )}
                  {words.map((word, i) => (
                     <Word key={i} target={word} typed={typedHistory[i]} isCurrent={i === activeWordIndex} input={currentWordInput} />
                  ))}
                </div>
                {!isFocused && <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/20 backdrop-blur-[1px]"><div className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.5em] flex items-center gap-4"><div className="w-12 h-[1px] bg-primary/20" /> CLICK TO RESUME <div className="w-12 h-[1px] bg-primary/20" /></div></div>}
              </div>

              <div className="mt-24 flex justify-between items-center text-on-surface-variant/10 text-[9px] font-bold uppercase tracking-[0.4em]">
                 <div className="flex gap-8"><span>TAB : RESTART</span><span>ESC : CONFIG</span></div>
                 <div className="flex items-center gap-4"><span>ENGINE v2.4</span><div className="w-2 h-2 grid-box bg-primary/10" /></div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .char { transition: color 0.1s ease-out, background 0.1s; }
      `}</style>
    </div>
  );
}
