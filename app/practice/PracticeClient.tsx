'use client';

import { useState, useRef, useEffect, useLayoutEffect, useMemo, memo } from 'react';
import { useTypingEngine, IN_MAP } from './useTypingEngine';
import { GenerationOptions } from './words';
import {
  Clock, Type, Quote, Mountain, Wrench, X, Play, RotateCcw,
  Settings2, BarChart3, RefreshCw, TrendingUp, Sun, Moon, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Keyboard Layout Mappings ─────────────────────────────────────
const ENG_PUNCT_KEY_MAP: Record<string, string> = {
  '`': 'Backquote', '~': 'Backquote',
  '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5',
  '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0',
  '-': 'Minus', '_': 'Minus', '=': 'Equal', '+': 'Equal',
  '[': 'BracketLeft', '{': 'BracketLeft', ']': 'BracketRight', '}': 'BracketRight',
  '\\': 'Backslash', '|': 'Backslash',
  ';': 'Semicolon', ':': 'Semicolon',
  "'": 'Quote', '"': 'Quote',
  ',': 'Comma', '<': 'Comma',
  '.': 'Period', '>': 'Period',
  '/': 'Slash', '?': 'Slash',
};

function getHighlightKeyInfo(targetChar: string, isHindi: boolean): { code: string; shift: boolean } | null {
  if (!targetChar) return null;
  if (targetChar === ' ') return { code: 'Space', shift: false };
  
  let keyToHighlight = targetChar;
  let isShift = false;
  
  if (isHindi) {
    let foundKey = null;
    for (const [engKey, hindiChar] of Object.entries(IN_MAP)) {
      if (hindiChar === targetChar) {
        foundKey = engKey;
        break;
      }
    }
    
    if (foundKey) {
      isShift = foundKey === foundKey.toUpperCase() && foundKey !== foundKey.toLowerCase();
      keyToHighlight = foundKey;
    } else {
      keyToHighlight = targetChar;
      isShift = targetChar === targetChar.toUpperCase() && targetChar !== targetChar.toLowerCase();
    }
  } else {
    isShift = targetChar === targetChar.toUpperCase() && targetChar !== targetChar.toLowerCase();
  }
  
  const upperKey = keyToHighlight.toUpperCase();
  
  if (/^[A-Z]$/.test(upperKey)) {
    return { code: `Key${upperKey}`, shift: isShift };
  }
  
  if (/^[0-9]$/.test(upperKey)) {
    return { code: `Digit${upperKey}`, shift: isShift };
  }
  
  const code = ENG_PUNCT_KEY_MAP[keyToHighlight] || null;
  if (code) {
    if (!isHindi) {
      const shiftedSymbols = '~!@#$%^&*()_+{}|:"<>?';
      isShift = shiftedSymbols.includes(keyToHighlight);
    }
    return { code, shift: isShift };
  }
  
  return null;
}

// ─── Key Type Definition ─────────────────────────────────────────
type KeyboardKey = {
  code: string;
  label: string;
  shiftLabel?: string;
  hindiLabel?: string;
  hindiShiftLabel?: string;
  /** 'char' = letter/number/punctuation, 'mod' = modifier/function, 'space' = spacebar */
  type: 'char' | 'mod' | 'space';
  /** flex-basis width in units (1 unit ≈ 40px). Default 1 */
  flex?: number;
};

// One flex unit = 40px. Standard alpha key = 1 unit.
const KB: KeyboardKey[][] = [
  // ── Row 0: Esc + F-keys ─────────────────────────────
  [
    { code: 'Escape',      label: 'Esc',  type: 'mod',   flex: 1 },
    { code: 'F1',          label: 'F1',   type: 'mod',   flex: 1 },
    { code: 'F2',          label: 'F2',   type: 'mod',   flex: 1 },
    { code: 'F3',          label: 'F3',   type: 'mod',   flex: 1 },
    { code: 'F4',          label: 'F4',   type: 'mod',   flex: 1 },
    { code: 'F5',          label: 'F5',   type: 'mod',   flex: 1 },
    { code: 'F6',          label: 'F6',   type: 'mod',   flex: 1 },
    { code: 'F7',          label: 'F7',   type: 'mod',   flex: 1 },
    { code: 'F8',          label: 'F8',   type: 'mod',   flex: 1 },
    { code: 'F9',          label: 'F9',   type: 'mod',   flex: 1 },
    { code: 'F10',         label: 'F10',  type: 'mod',   flex: 1 },
    { code: 'F11',         label: 'F11',  type: 'mod',   flex: 1 },
    { code: 'F12',         label: 'F12',  type: 'mod',   flex: 1 },
    { code: 'Delete',      label: 'Del',  type: 'mod',   flex: 1 },
  ],
  // ── Row 1: Number row + Backspace ─────────────────
  [
    { code: 'Backquote',   label: '`',  shiftLabel: '~',  hindiLabel: 'ॊ', hindiShiftLabel: 'ऒ',  type: 'char', flex: 1 },
    { code: 'Digit1',      label: '1',  shiftLabel: '!',  hindiLabel: '१', hindiShiftLabel: 'ऍ',  type: 'char', flex: 1 },
    { code: 'Digit2',      label: '2',  shiftLabel: '@',  hindiLabel: '२', hindiShiftLabel: 'ॅ',  type: 'char', flex: 1 },
    { code: 'Digit3',      label: '3',  shiftLabel: '#',  hindiLabel: '३', hindiShiftLabel: '्र', type: 'char', flex: 1 },
    { code: 'Digit4',      label: '4',  shiftLabel: '$',  hindiLabel: '४', hindiShiftLabel: 'र्', type: 'char', flex: 1 },
    { code: 'Digit5',      label: '5',  shiftLabel: '%',  hindiLabel: '५', hindiShiftLabel: 'ज्ञ',type: 'char', flex: 1 },
    { code: 'Digit6',      label: '6',  shiftLabel: '^',  hindiLabel: '६', hindiShiftLabel: 'त्र',type: 'char', flex: 1 },
    { code: 'Digit7',      label: '7',  shiftLabel: '&',  hindiLabel: '७', hindiShiftLabel: 'क्ष',type: 'char', flex: 1 },
    { code: 'Digit8',      label: '8',  shiftLabel: '*',  hindiLabel: '८', hindiShiftLabel: 'श्र',type: 'char', flex: 1 },
    { code: 'Digit9',      label: '9',  shiftLabel: '(',  hindiLabel: '९', hindiShiftLabel: '(',  type: 'char', flex: 1 },
    { code: 'Digit0',      label: '0',  shiftLabel: ')',  hindiLabel: '०', hindiShiftLabel: ')',  type: 'char', flex: 1 },
    { code: 'Minus',       label: '-',  shiftLabel: '_',  hindiLabel: '-', hindiShiftLabel: 'ः',  type: 'char', flex: 1 },
    { code: 'Equal',       label: '=',  shiftLabel: '+',  hindiLabel: 'ृ', hindiShiftLabel: 'ऋ',  type: 'char', flex: 1 },
    { code: 'Backspace',   label: '⌫ Backspace',          type: 'mod',  flex: 2 },
  ],
  // ── Row 2: Tab + QWERTY ──────────────────────────
  [
    { code: 'Tab',         label: 'Tab ⇥',               type: 'mod',  flex: 1.5 },
    { code: 'KeyQ',        label: 'Q',  hindiLabel: 'ौ', hindiShiftLabel: 'औ',  type: 'char', flex: 1 },
    { code: 'KeyW',        label: 'W',  hindiLabel: 'ै', hindiShiftLabel: 'ऐ',  type: 'char', flex: 1 },
    { code: 'KeyE',        label: 'E',  hindiLabel: 'ा', hindiShiftLabel: 'आ',  type: 'char', flex: 1 },
    { code: 'KeyR',        label: 'R',  hindiLabel: 'ी', hindiShiftLabel: 'ई',  type: 'char', flex: 1 },
    { code: 'KeyT',        label: 'T',  hindiLabel: 'ू', hindiShiftLabel: 'ऊ',  type: 'char', flex: 1 },
    { code: 'KeyY',        label: 'Y',  hindiLabel: 'ब', hindiShiftLabel: 'भ',  type: 'char', flex: 1 },
    { code: 'KeyU',        label: 'U',  hindiLabel: 'ह', hindiShiftLabel: 'ङ',  type: 'char', flex: 1 },
    { code: 'KeyI',        label: 'I',  hindiLabel: 'ग', hindiShiftLabel: 'घ',  type: 'char', flex: 1 },
    { code: 'KeyO',        label: 'O',  hindiLabel: 'द', hindiShiftLabel: 'ध',  type: 'char', flex: 1 },
    { code: 'KeyP',        label: 'P',  hindiLabel: 'ज', hindiShiftLabel: 'झ',  type: 'char', flex: 1 },
    { code: 'BracketLeft', label: '[',  shiftLabel: '{', hindiLabel: 'ड', hindiShiftLabel: 'ढ',  type: 'char', flex: 1 },
    { code: 'BracketRight',label: ']',  shiftLabel: '}', hindiLabel: '़', hindiShiftLabel: 'ञ',  type: 'char', flex: 1 },
    { code: 'Backslash',   label: '\\', shiftLabel: '|', hindiLabel: 'ॉ', hindiShiftLabel: 'ऑ', type: 'char', flex: 1.5 },
  ],
  // ── Row 3: Caps + ASDF + Enter ──────────────────
  [
    { code: 'CapsLock',    label: '⇪ Caps',              type: 'mod',  flex: 1.75 },
    { code: 'KeyA',        label: 'A',  hindiLabel: 'ो', hindiShiftLabel: 'ओ',  type: 'char', flex: 1 },
    { code: 'KeyS',        label: 'S',  hindiLabel: 'े', hindiShiftLabel: 'ए',  type: 'char', flex: 1 },
    { code: 'KeyD',        label: 'D',  hindiLabel: '्', hindiShiftLabel: 'अ',  type: 'char', flex: 1 },
    { code: 'KeyF',        label: 'F',  hindiLabel: 'ि', hindiShiftLabel: 'इ',  type: 'char', flex: 1 },
    { code: 'KeyG',        label: 'G',  hindiLabel: 'ु', hindiShiftLabel: 'उ',  type: 'char', flex: 1 },
    { code: 'KeyH',        label: 'H',  hindiLabel: 'प', hindiShiftLabel: 'फ',  type: 'char', flex: 1 },
    { code: 'KeyJ',        label: 'J',  hindiLabel: 'र', hindiShiftLabel: 'ऱ',  type: 'char', flex: 1 },
    { code: 'KeyK',        label: 'K',  hindiLabel: 'क', hindiShiftLabel: 'ख',  type: 'char', flex: 1 },
    { code: 'KeyL',        label: 'L',  hindiLabel: 'त', hindiShiftLabel: 'थ',  type: 'char', flex: 1 },
    { code: 'Semicolon',   label: ';',  shiftLabel: ':', hindiLabel: 'च', hindiShiftLabel: 'छ',  type: 'char', flex: 1 },
    { code: 'Quote',       label: "'",  shiftLabel: '"', hindiLabel: 'ट', hindiShiftLabel: 'ठ',  type: 'char', flex: 1 },
    { code: 'Enter',       label: '↵ Enter',              type: 'mod',  flex: 2.25 },
  ],
  // ── Row 4: Shift + ZXCV + Shift ─────────────────
  [
    { code: 'ShiftLeft',   label: '⇧ Shift',              type: 'mod',  flex: 2.25 },
    { code: 'KeyZ',        label: 'Z',  hindiLabel: 'ॆ', hindiShiftLabel: 'ऎ',  type: 'char', flex: 1 },
    { code: 'KeyX',        label: 'X',  hindiLabel: 'ं', hindiShiftLabel: 'ँ',  type: 'char', flex: 1 },
    { code: 'KeyC',        label: 'C',  hindiLabel: 'म', hindiShiftLabel: 'ण',  type: 'char', flex: 1 },
    { code: 'KeyV',        label: 'V',  hindiLabel: 'न', hindiShiftLabel: 'ऩ',  type: 'char', flex: 1 },
    { code: 'KeyB',        label: 'B',  hindiLabel: 'व', hindiShiftLabel: 'ऴ',  type: 'char', flex: 1 },
    { code: 'KeyN',        label: 'N',  hindiLabel: 'ल', hindiShiftLabel: 'ळ',  type: 'char', flex: 1 },
    { code: 'KeyM',        label: 'M',  hindiLabel: 'स', hindiShiftLabel: 'श',  type: 'char', flex: 1 },
    { code: 'Comma',       label: ',',  shiftLabel: '<', hindiLabel: ',', hindiShiftLabel: 'ष', type: 'char', flex: 1 },
    { code: 'Period',      label: '.',  shiftLabel: '>', hindiLabel: '।', hindiShiftLabel: '.', type: 'char', flex: 1 },
    { code: 'Slash',       label: '/',  shiftLabel: '?', hindiLabel: 'य', hindiShiftLabel: 'य़',type: 'char', flex: 1 },
    { code: 'ShiftRight',  label: '⇧ Shift',              type: 'mod',  flex: 2.75 },
  ],
  // ── Row 5: Bottom row ────────────────────────────
  [
    { code: 'ControlLeft', label: 'Ctrl',  type: 'mod',   flex: 1.25 },
    { code: 'MetaLeft',    label: '⌘',     type: 'mod',   flex: 1.25 },
    { code: 'AltLeft',     label: 'Alt',   type: 'mod',   flex: 1.25 },
    { code: 'Space',       label: '',      type: 'space',  flex: 6.25 },
    { code: 'AltRight',    label: 'Alt',   type: 'mod',   flex: 1.25 },
    { code: 'ArrowLeft',   label: '←',     type: 'mod',   flex: 1 },
    { code: 'ArrowUp',     label: '↑',     type: 'mod',   flex: 1 },
    { code: 'ArrowDown',   label: '↓',     type: 'mod',   flex: 1 },
    { code: 'ArrowRight',  label: '→',     type: 'mod',   flex: 1 },
  ],
];

// ─── Single Key Cell ─────────────────────────────────────────────
function KeyCell({
  kb, isHighlighted, style, language,
}: {
  kb: KeyboardKey;
  isHighlighted: boolean;
  style: 'standard' | 'neon' | 'retro' | 'glass' | 'cyberpunk';
  language: 'english' | 'hindi';
}) {
  const isHindi = language === 'hindi';
  const primary   = kb.type === 'char' ? (isHindi ? (kb.hindiLabel   || kb.label)      : kb.label)      : kb.label;
  const secondary = kb.type === 'char' ? (isHindi ? kb.hindiShiftLabel : kb.shiftLabel)                  : undefined;
  const isChar    = kb.type === 'char';
  const isMod     = kb.type === 'mod';
  const isSpace   = kb.type === 'space';

  // Base colors per key type and style
  let baseStyle = '';
  let pressedStyle = '';
  let shadow3d = '';
  let pressedShadow = '';

  if (style === 'standard') {
    // Dark theme / Light theme premium look
    const charBase  = 'dark:bg-[#2a2a35] bg-[#e0e0e8] dark:text-[#c8c8e0] text-[#1a1a2e] dark:border-[#3a3a50]/80 border-[#b0b0c0]';
    const modBase   = 'dark:bg-[#1e1e28] bg-[#cbcbd8] dark:text-[#8888aa] text-[#4a4a6a] dark:border-[#303045]/80 border-[#a0a0b5]';
    const spaceBase = 'dark:bg-[#252535] bg-[#d8d8e8] dark:text-[#6666aa] text-[#3a3a6a] dark:border-[#353550]/80 border-[#ababc0]';

    baseStyle    = `border rounded-[5px] ${isChar ? charBase : isMod ? modBase : spaceBase}`;
    shadow3d     = 'shadow-[0_4px_0_0] dark:shadow-[#0d0d18] shadow-[#9898a8]';
    pressedStyle = `${isChar ? charBase : isMod ? modBase : spaceBase} border rounded-[5px]`;
    pressedShadow= 'shadow-[0_1px_0_0] dark:shadow-[#0d0d18] shadow-[#9898a8] translate-y-[3px]';
  } else if (style === 'neon') {
    const charBase  = 'bg-[#0d0d1a] text-[#a0a0ff] border-[#3030a0]/60';
    const modBase   = 'bg-[#080812] text-[#606090] border-[#202060]/50';
    const spaceBase = 'bg-[#0a0a16] text-[#5050a0] border-[#252575]/50';

    baseStyle    = `border rounded-[4px] ${isChar ? charBase : isMod ? modBase : spaceBase}`;
    shadow3d     = 'shadow-[0_4px_0_0] shadow-[#05050f]';
    pressedStyle = `${isChar ? charBase : isMod ? modBase : spaceBase} border rounded-[4px]`;
    pressedShadow= 'shadow-[0_1px_0_0] shadow-[#05050f] translate-y-[3px]';
  } else if (style === 'retro') {
    const charBase  = 'dark:bg-[#3a3a2e] bg-[#d8d4b0] dark:text-[#d8d890] text-[#2a2810] dark:border-[#555540] border-[#a8a48a]';
    const modBase   = 'dark:bg-[#2e2e28] bg-[#c8c4a0] dark:text-[#909070] text-[#4a4828] dark:border-[#444438] border-[#989478]';
    const spaceBase = 'dark:bg-[#383830] bg-[#d0cc9a] dark:text-[#707058] text-[#383618] dark:border-[#4a4a3c] border-[#a0988a]';

    baseStyle    = `border-2 rounded-[3px] font-bold ${isChar ? charBase : isMod ? modBase : spaceBase}`;
    shadow3d     = 'shadow-[2px_4px_0_0] dark:shadow-[#12120c] shadow-[#808060]';
    pressedStyle = `${isChar ? charBase : isMod ? modBase : spaceBase} border-2 rounded-[3px] font-bold`;
    pressedShadow= 'shadow-[0px_1px_0_0] dark:shadow-[#12120c] shadow-[#808060] translate-x-[2px] translate-y-[3px]';
  } else if (style === 'glass') {
    const charBase  = 'dark:bg-white/[0.04] bg-black/[0.03] dark:text-white/80 text-black/80 dark:border-white/10 border-black/10 backdrop-blur-[6px]';
    const modBase   = 'dark:bg-white/[0.015] bg-black/[0.01] dark:text-white/50 text-black/50 dark:border-white/5 border-black/5 backdrop-blur-[6px]';
    const spaceBase = 'dark:bg-white/[0.03] bg-black/[0.02] dark:text-white/40 text-black/40 dark:border-white/10 border-black/10 backdrop-blur-[6px]';

    baseStyle    = `border rounded-[6px] ${isChar ? charBase : isMod ? modBase : spaceBase}`;
    shadow3d     = 'shadow-[0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]';
    pressedStyle = `${isChar ? charBase : isMod ? modBase : spaceBase} border rounded-[6px]`;
    pressedShadow= 'shadow-[0_1px_2px_rgba(0,0,0,0.05)] translate-y-[2px]';
  } else {
    // cyberpunk
    const charBase  = 'bg-[#150d22] text-[#00f3ff] border-[#ff007f]/40 font-mono';
    const modBase   = 'bg-[#0b0615] text-[#ff007f] border-[#00f3ff]/20 font-mono';
    const spaceBase = 'bg-[#100a1c] text-[#00f3ff]/70 border-[#ff007f]/30';

    baseStyle    = `border rounded-[2px] uppercase ${isChar ? charBase : isMod ? modBase : spaceBase}`;
    shadow3d     = 'shadow-[0_4px_0_0_#ff007f]';
    pressedStyle = `${isChar ? charBase : isMod ? modBase : spaceBase} border rounded-[2px]`;
    pressedShadow= 'shadow-[0_1px_0_0_#ff007f] translate-y-[3px]';
  }

  const highlightOver = isHighlighted
    ? style === 'neon'
      ? 'border-[#7070ff] bg-[#1a1a40] text-[#b0b0ff] shadow-[0_0_10px_2px_rgba(100,100,255,0.4)]'
      : style === 'retro'
        ? 'dark:bg-[#5a5820] bg-[#ffffaa] dark:text-[#ffee40] text-[#3a3800] dark:border-[#888840] border-[#c8c040]'
        : style === 'glass'
          ? 'dark:bg-white/15 bg-black/10 border-white/40 text-primary dark:shadow-[0_0_12px_rgba(255,255,255,0.15)] shadow-[0_0_12px_rgba(0,0,0,0.08)] font-black'
          : style === 'cyberpunk'
            ? 'bg-[#ffff00] border-[#ffff00] text-black shadow-[0_0_12px_#ffff00] font-black'
            : 'dark:bg-[#3a3060] bg-[#d8d0ff] dark:text-[#c8b4ff] text-[#2a0080] dark:border-[#6040c0] border-[#8060e0]'
    : '';

  const finalShadow = isHighlighted ? pressedShadow : shadow3d;
  const finalState  = isHighlighted ? pressedStyle  : baseStyle;

  return (
    <div
      style={{ flexGrow: kb.flex ?? 1, flexShrink: 0, flexBasis: `${(kb.flex ?? 1) * 32}px`, minWidth: `${(kb.flex ?? 1) * 22}px` }}
      className={`
        relative h-[28px] sm:h-[36px] flex flex-col items-center justify-center
        transition-all duration-[60ms] ease-out select-none
        ${finalState} ${finalShadow} ${isHighlighted ? highlightOver : ''}
      `}
    >
      {/* Shift / secondary label — top-right corner */}
      {secondary && (
        <span className="absolute top-[2px] right-[4px] text-[7px] sm:text-[8px] opacity-40 font-semibold leading-none">
          {secondary}
        </span>
      )}

      {/* Primary label */}
      {isSpace ? (
        <span className="text-[8px] opacity-35 tracking-[0.25em] uppercase font-bold">space</span>
      ) : isChar ? (
        <span className="text-[10px] sm:text-xs font-bold leading-none">{primary}</span>
      ) : (
        <span className="text-[7.5px] sm:text-[8.5px] font-semibold tracking-wide leading-none text-center px-0.5">{primary}</span>
      )}
    </div>
  );
}

function VirtualKeyboard({
  highlightKey,
  style,
  language,
}: {
  highlightKey: { code: string; shift: boolean } | null;
  style: 'standard' | 'neon' | 'retro' | 'glass' | 'cyberpunk';
  language: 'english' | 'hindi';
}) {
  return (
    <div
      className={`
        w-full flex flex-col gap-[4px] sm:gap-[5px] select-none max-w-3xl mx-auto overflow-x-auto no-scrollbar shrink-0
        p-2 sm:p-3 rounded-xl
        dark:bg-[#13131f] bg-[#e8e8f0]
        dark:border dark:border-white/[0.06] border border-black/[0.08]
        dark:shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03)]
        shadow-[0_6px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]
      `}
    >
      {KB.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-[3px] sm:gap-[4px] w-full">
          {row.map(key => {
            const isHighlighted = !!highlightKey && (
              highlightKey.code === key.code ||
              (highlightKey.shift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight'))
            );
            return (
              <KeyCell
                key={key.code}
                kb={key}
                isHighlighted={isHighlighted}
                style={style}
                language={language}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Memoized Word Component ─────────────────────────────────────
const Word = memo(({ target, typed, isCurrent, input }: {
  target: string;
  typed?: string;
  isCurrent: boolean;
  input: string;
}) => {
  return (
    <span className={`${isCurrent ? 'active-word' : ''} mx-[0.25em] my-[0.3em] inline-block relative transition-none select-none`}>
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

  // Settings preferences state
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [keyboardStyle, setKeyboardStyle] = useState<'standard' | 'neon' | 'retro' | 'glass' | 'cyberpunk'>('standard');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState<'mono' | 'sans' | 'serif'>('mono');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [guestRunsCount, setGuestRunsCount] = useState(0);
  const [sysConfig, setSysConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.authenticated) setUser(d.user);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const runs = parseInt(localStorage.getItem('ht_guest_practice_runs') || '0', 10);
      setGuestRunsCount(runs);
    }

    // Fetch paywall settings
    fetch('/api/system-config')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.success) {
          setSysConfig(d);
        }
      })
      .catch(() => {});
  }, []);

  const handleTestFinish = async (stats: any) => {
    if (!user) {
      // Guest practice runs increment
      const nextRuns = guestRunsCount + 1;
      setGuestRunsCount(nextRuns);
      localStorage.setItem('ht_guest_practice_runs', String(nextRuns));
      return;
    }
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

  // Sync preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedShow = localStorage.getItem('ht_showKeyboard');
      if (savedShow !== null) setShowKeyboard(savedShow === 'true');
      
      const savedStyle = localStorage.getItem('ht_keyboardStyle');
      if (savedStyle) setKeyboardStyle(savedStyle as any);
      
      const savedSize = localStorage.getItem('ht_fontSize');
      if (savedSize) setFontSize(savedSize as any);
      
      const savedFamily = localStorage.getItem('ht_fontFamily');
      if (savedFamily) setFontFamily(savedFamily as any);

      const savedLang = localStorage.getItem('ht_language') as 'english' | 'hindi';
      if (savedLang) {
        initializeEngine({ ...options, language: savedLang });
      }

      const syncTheme = () => {
        const isLight = document.documentElement.classList.contains('light') || localStorage.getItem('ht_theme') === 'light';
        setTheme(isLight ? 'light' : 'dark');
      };
      syncTheme();
      window.addEventListener('storage', syncTheme);
      return () => window.removeEventListener('storage', syncTheme);
    }
  }, []);

  // Sync preference handlers
  const updateShowKeyboard = (val: boolean) => {
    setShowKeyboard(val);
    localStorage.setItem('ht_showKeyboard', String(val));
  };
  const updateKeyboardStyle = (val: 'standard' | 'neon' | 'retro' | 'glass' | 'cyberpunk') => {
    setKeyboardStyle(val);
    localStorage.setItem('ht_keyboardStyle', val);
  };
  const updateFontSize = (val: 'small' | 'medium' | 'large') => {
    setFontSize(val);
    localStorage.setItem('ht_fontSize', val);
  };
  const updateFontFamily = (val: 'mono' | 'sans' | 'serif') => {
    setFontFamily(val);
    localStorage.setItem('ht_fontFamily', val);
  };
  const updateTheme = (val: 'dark' | 'light') => {
    setTheme(val);
    localStorage.setItem('ht_theme', val);
    if (val === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    window.dispatchEvent(new Event('storage'));
  };
  const updateLanguage = (lang: 'english' | 'hindi') => {
    localStorage.setItem('ht_language', lang);
    initializeEngine({ ...options, language: lang });
  };

  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const [isWordJump, setIsWordJump] = useState(false);
  const [lineOffset, setLineOffset] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const prevWordIndex = useRef(0);

  // Dynamic caretaker typography metrics
  const caretMetrics = useMemo(() => {
    switch (fontSize) {
      case 'small':
        return { height: 26, offset: 4, line: 47, containerHeight: 155, class: 'text-[20px] sm:text-[23px] md:text-[26px]' };
      case 'large':
        return { height: 46, offset: 8, line: 80, containerHeight: 260, class: 'text-[32px] sm:text-[38px] md:text-[44px]' };
      case 'medium':
      default:
        return { height: 36, offset: 6, line: 62, containerHeight: 200, class: 'text-[26px] sm:text-[30px] md:text-[34px]' };
    }
  }, [fontSize]);

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
    const y = activeSpan.offsetTop + caretMetrics.offset;

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

    const lineHeight = caretMetrics.line;
    if (activeSpan.offsetTop > lineHeight * 1.5) {
      setLineOffset(activeSpan.offsetTop - lineHeight);
    } else {
      setLineOffset(0);
    }
  }, [currentWordInput, activeWordIndex, status, words, caretMetrics]);

  // Next Key Highlight calculation
  const nextKeyInfo = useMemo(() => {
    if (status === 'finished') return null;
    const targetWord = words[activeWordIndex];
    if (!targetWord) return null;
    
    const targetChar = currentWordInput.length === targetWord.length
      ? ' '
      : targetWord[currentWordInput.length];
      
    return getHighlightKeyInfo(targetChar, options.language === 'hindi');
  }, [words, activeWordIndex, currentWordInput, status, options.language]);

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

  // Intercept and show register paywall if guest user exceeds practice limits
  if (!user && sysConfig && guestRunsCount >= sysConfig.freePracticeLimitBeforeLogin) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] mt-14 flex items-center justify-center p-6 bg-background font-mono text-on-surface select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md grid-box p-8 bg-gradient-to-br from-primary/[0.04] via-surface-container-low to-surface-container-low border border-primary/20 rounded-2xl relative overflow-hidden text-center space-y-6"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.01] pointer-events-none">
            <Lock className="w-48 h-48 text-primary" />
          </div>

          <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tight text-primary">Register Free to Continue</h2>
            <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
              Guest run limit reached
            </p>
          </div>

          <p className="text-xs text-on-surface-variant/70 leading-relaxed font-sans">
            You have completed your limit of <strong className="text-primary font-bold">{sysConfig.freePracticeLimitBeforeLogin} free guest runs</strong>. Register a free account to continue practicing, track your WPM stats over time, and participate in global rankings!
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <a
              href="/register?redirect=practice"
              className="w-full py-4 rounded-xl bg-primary text-background hover:bg-primary/95 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center font-bold"
            >
              Create Free Account
            </a>
            <a
              href="/login?redirect=practice"
              className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center"
            >
              Sign In
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── TYPING / IDLE SCREEN ─────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col font-mono text-on-surface overflow-hidden relative selection:bg-primary/10">

      {/* ── Settings Sidebar ───────────────────────────────────── */}
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
              className="fixed top-0 right-0 h-full w-full sm:w-85 bg-surface-container-low border-l border-white/5 z-50 flex flex-col shadow-2xl overflow-hidden text-on-surface"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">Preferences</p>
                  <h2 className="text-sm font-black uppercase text-on-surface tracking-wide mt-0.5">Settings & Controls</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="grid-box p-2 hover:bg-white/5 transition-colors text-on-surface-variant cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                
                {/* 1. LANGUAGE */}
                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Language / भाषा
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'english', label: 'English' },
                      { id: 'hindi', label: 'हिन्दी (InScript)' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateLanguage(item.id as any)}
                        className={`py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          options.language === item.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. THEME */}
                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-3.5 h-3.5" /> },
                      { id: 'light', label: 'Light Mode', icon: <Sun className="w-3.5 h-3.5" /> }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateTheme(item.id as any)}
                        className={`py-2.5 flex items-center justify-center gap-2 rounded-[2px] text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          theme === item.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. VIRTUAL KEYBOARD DISPLAY */}
                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Virtual Keyboard Guide
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: true, label: 'Show' },
                      { id: false, label: 'Hide' }
                    ].map(item => (
                      <button
                        key={String(item.id)}
                        onClick={() => updateShowKeyboard(item.id)}
                        className={`py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          showKeyboard === item.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. KEYBOARD STYLE */}
                {showKeyboard && (
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                      Keyboard Style
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'standard', label: 'Standard' },
                        { id: 'neon', label: 'Neon' },
                        { id: 'retro', label: 'Retro' },
                        { id: 'glass', label: 'Glass' },
                        { id: 'cyberpunk', label: 'Cyberpunk' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => updateKeyboardStyle(item.id as any)}
                          className={`py-2.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                            keyboardStyle === item.id
                              ? 'bg-primary/10 text-primary border-primary/30'
                              : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'small', label: 'Small' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'large', label: 'Large' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateFontSize(item.id as any)}
                        className={`py-2.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          fontSize === item.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. FONT FAMILY */}
                <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                    Font Family
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'mono', label: 'Monospace' },
                      { id: 'sans', label: 'Sans-Serif' },
                      { id: 'serif', label: 'Serif' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateFontFamily(item.id as any)}
                        className={`py-2.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          fontFamily === item.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-white/5 text-on-surface-variant/40 hover:border-white/10 hover:bg-white/3'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. CUSTOM TEXT OPTIONS (Only if mode is custom) */}
                {options.mode === 'custom' && (
                  <div className="border-t border-white/5 pt-5 space-y-4">
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                        Custom Input Text
                      </label>
                      <textarea
                        className="w-full h-32 bg-black/30 border border-white/5 rounded-[2px] p-3 text-xs text-on-surface focus:border-primary/30 outline-none transition-colors resize-none font-mono leading-relaxed placeholder-on-surface-variant/20"
                        placeholder="Paste your custom text here…"
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">
                        Shuffle Words
                      </label>
                      <button
                        onClick={() => setCustomShuffle(!customShuffle)}
                        className={`w-full py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${customShuffle
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'border-white/5 text-on-surface-variant/30 hover:border-white/10'}`}
                      >
                        {customShuffle ? '✓ Shuffle On' : 'Shuffle Off'}
                      </button>
                    </div>

                    <button
                      onClick={startCustomMode}
                      disabled={!customText.trim()}
                      className="w-full grid-box py-3.5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary border-primary/40 bg-primary/8 hover:bg-primary/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Save & Restart
                    </button>
                  </div>
                )}

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

          {/* Right section: Timer & Settings */}
          <div className="flex items-center gap-3 shrink-0">
            {status === 'running' && (
              <div>
                {options.mode === 'time' ? (
                  <span className={`text-base font-black tabular-nums ${timeRemaining <= 5 ? 'text-error animate-pulse' : 'text-primary/60'}`}>
                    {timeRemaining}s
                  </span>
                ) : (
                  <span className="text-base font-black tabular-nums text-on-surface-variant/30">{timeElapsed}s</span>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 border border-white/5 hover:border-white/10 bg-white/3 hover:bg-white/5 rounded-[2px] text-on-surface-variant/60 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
              title="Open Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
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
              <div className="relative w-full overflow-hidden" style={{ height: `${caretMetrics.containerHeight}px` }}>
                <div
                  ref={wordsContainerRef}
                  className={`absolute top-0 left-0 w-full leading-[1.2] ${caretMetrics.class} ${
                    fontFamily === 'mono' ? 'font-mono' : fontFamily === 'sans' ? 'font-sans' : 'font-serif'
                  } flex flex-wrap content-start select-none transition-all duration-300 ${!isFocused ? 'opacity-[0.06] blur-[3px]' : ''}`}
                  style={{ transform: `translateY(-${lineOffset}px)` }}
                >
                  {/* Caret */}
                  {isFocused && (
                    <div
                      className={`caret ${status === 'running' ? '' : 'caret-blink'} ${isWordJump ? 'caret-instant' : ''}`}
                      style={{
                        height: `${caretMetrics.height}px`,
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

          {/* ── Virtual Keyboard ── */}
          {showKeyboard && (status === 'idle' || status === 'running') && (
            <div className="mt-8 sm:mt-12 md:mt-16 w-full">
              <VirtualKeyboard
                highlightKey={nextKeyInfo}
                style={keyboardStyle}
                language={options.language || 'english'}
              />
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
