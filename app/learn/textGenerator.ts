// ─── Text Generator for Learn Mode ──────────────────────────────
// Generates practice text using only the allowed keys for a lesson.

import { Lesson } from './lessonData';

// A small filtered English word bank — words using only common letter combos.
// Used for lessons L10+ when enough letters are available.
const WORD_BANK = [
  // Home row words
  'a', 'as', 'ask', 'dad', 'fad', 'gag', 'had', 'has', 'jag', 'lad', 'lag',
  'sad', 'gas', 'lass', 'lass', 'flash', 'flask', 'half', 'hall', 'fall',
  'shall', 'salad', 'glass', 'slab', 'flag', 'glad', 'slag',
  // Home + top
  'are', 'ark', 'our', 'fur', 'rue', 'rue', 'red', 'use', 'urge', 'rust',
  'sure', 'pure', 'ruse', 'duke', 'dusk', 'fuse', 'juke', 'lure', 'lure',
  'girl', 'golf', 'gust', 'silk', 'sire', 'fire', 'hire', 'wire', 'tire',
  'like', 'ride', 'side', 'hide', 'wide', 'life', 'wife', 'dish', 'fish',
  'wish', 'risk', 'disk', 'link', 'sink', 'silk', 'film', 'fill', 'hill',
  'kill', 'mill', 'pill', 'sill', 'will', 'till', 'gill', 'skill', 'spill',
  'still', 'drill', 'grill', 'thrill', 'quill', 'world', 'write', 'works',
  'floor', 'floor', 'sport', 'sort', 'port', 'pore', 'lore', 'wore', 'more',
  'four', 'pour', 'sour', 'tour', 'your', 'hour', 'pour', 'flour', 'power',
  // With bottom row
  'cave', 'gave', 'have', 'rave', 'save', 'wave', 'cove', 'dove', 'love',
  'move', 'rove', 'wove', 'cube', 'lube', 'tube', 'curb', 'verb', 'carve',
  'name', 'came', 'fame', 'game', 'lame', 'same', 'tame', 'come', 'dome',
  'home', 'nome', 'some', 'bone', 'cone', 'done', 'gone', 'hone', 'lone',
  'none', 'tone', 'zone', 'mine', 'dine', 'fine', 'line', 'pine', 'vine',
  'wine', 'nine', 'cane', 'lane', 'mane', 'pane', 'sane', 'vane', 'wane',
  'nice', 'mice', 'rice', 'vice', 'lice', 'dice', 'once', 'ounce', 'bounce',
  'ince', 'since', 'fence', 'hence', 'tense', 'dense', 'sense', 'hence',
  'back', 'black', 'block', 'click', 'clock', 'crack', 'crick', 'dock',
  'flock', 'knock', 'lock', 'luck', 'mock', 'muck', 'nick', 'nock', 'pick',
  'rack', 'rick', 'rock', 'sick', 'slick', 'smock', 'snack', 'sock', 'stack',
  'stick', 'stock', 'struck', 'stuck', 'suck', 'tack', 'thick', 'tick', 'track',
  'trick', 'truck', 'tuck', 'wick', 'wreck',
  // More common words
  'the', 'and', 'for', 'not', 'but', 'can', 'get', 'use', 'her', 'him',
  'his', 'its', 'let', 'low', 'may', 'men', 'new', 'now', 'old', 'one',
  'our', 'out', 'own', 'put', 'run', 'saw', 'set', 'she', 'six', 'ten',
  'two', 'was', 'way', 'who', 'why', 'yet', 'you', 'all', 'day', 'did',
  'end', 'few', 'had', 'has', 'how', 'led', 'off', 'see', 'too', 'top',
];

// ─── Pure key sequence generator for early lessons ──────────────

/**
 * Generates random character sequences only using the allowed keys.
 * Used for lessons 1-9 where keys are too limited for real words.
 */
function generateKeySequences(keys: string[], wordCount: number): string[] {
  const result: string[] = [];
  const newestKeys = keys.slice(-2); // Weight newest keys more

  for (let w = 0; w < wordCount; w++) {
    // Word length: 3-7 chars
    const len = Math.floor(Math.random() * 4) + 3;
    let word = '';
    for (let c = 0; c < len; c++) {
      // 50% chance to use newest keys to reinforce them
      const pool = Math.random() < 0.5 ? newestKeys : keys;
      word += pool[Math.floor(Math.random() * pool.length)];
    }
    result.push(word);
  }
  return result;
}

/**
 * Filter word bank to only include words that can be typed with allowed keys.
 * Normalizes to lowercase.
 */
function filterWordsByKeys(allowedKeys: string[]): string[] {
  const keySet = new Set(allowedKeys.map(k => k.toLowerCase()));
  return WORD_BANK.filter(word =>
    word.toLowerCase().split('').every(ch => keySet.has(ch))
  );
}

/**
 * Generate a set of words for display, mixing real words (if available)
 * with key sequence drills.
 */
export function generatePracticeText(lesson: Lesson, count: number = 40): string[] {
  const { allKeys, id } = lesson;
  // normalizedKeys is only used to filter the alphabetical word bank
  const normalizedKeys = allKeys.map(k => k.toLowerCase()).filter(k => k.length === 1 && /[a-z]/.test(k));

  // Very early lessons (L1-L9) or symbol/number lessons with few letters: pure key sequences of all allowed keys
  if (id <= 9 || normalizedKeys.length < 4) {
    const seqs = generateKeySequences(allKeys, count);
    return seqs;
  }

  // Lesson 10+: attempt real word matching, fall back to sequences
  const matchedWords = filterWordsByKeys(normalizedKeys);

  if (matchedWords.length >= 5) {
    // Mix real words with key sequences (75% real, 25% sequences)
    const result: string[] = [];
    const realCount = Math.floor(count * 0.75);
    const seqCount  = count - realCount;

    for (let i = 0; i < realCount; i++) {
      // Weight shorter words for beginner lessons, longer for advanced
      const pool = lesson.id > 30
        ? matchedWords
        : matchedWords.filter(w => w.length <= 5);
      const src = pool.length > 0 ? pool : matchedWords;
      result.push(src[Math.floor(Math.random() * src.length)]);
    }

    const seqs = generateKeySequences(allKeys, seqCount);
    result.push(...seqs);

    // Shuffle
    return result.sort(() => Math.random() - 0.5);
  }

  // Not enough real words — fall back to key sequences of all allowed keys
  return generateKeySequences(allKeys, count);
}

/**
 * Generates a focused drill for a specific weak key.
 * Inserts the target key more frequently into the sequence.
 */
export function generateWeakKeyDrill(weakKey: string, allowedKeys: string[], count: number = 40): string[] {
  const result: string[] = [];
  for (let w = 0; w < count; w++) {
    const len = Math.floor(Math.random() * 4) + 3;
    let word = '';
    for (let c = 0; c < len; c++) {
      // 40% chance of weak key
      if (Math.random() < 0.4) {
        word += weakKey;
      } else {
        word += allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
      }
    }
    result.push(word);
  }
  return result;
}
