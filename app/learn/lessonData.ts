// ─── Lesson Type Definitions ─────────────────────────────────────

export type LessonType = 'keys' | 'drill' | 'test' | 'challenge';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Lesson = {
  id: number;
  level: number;
  title: string;
  subtitle: string;
  keys: string[];       // Keys introduced/practiced in this lesson
  allKeys: string[];    // All allowed keys (includes prior lessons for drills)
  type: LessonType;
  difficulty: Difficulty;
  target_wpm: number;
  target_accuracy: number;
  xp: number;
  description: string;
  fingerHints: Record<string, string>; // key -> finger name
};

// ─── Finger Zones ────────────────────────────────────────────────

export const FINGER_COLORS: Record<string, string> = {
  'left-pinky':   '#818cf8', // indigo
  'left-ring':    '#60a5fa', // blue
  'left-middle':  '#34d399', // emerald
  'left-index':   '#4ade80', // green
  'right-index':  '#facc15', // yellow
  'right-middle': '#fb923c', // orange
  'right-ring':   '#f87171', // red
  'right-pinky':  '#e879f9', // pink
  'thumb':        '#94a3b8', // slate
};

// Full keyboard finger map
export const KEY_FINGER_MAP: Record<string, string> = {
  // Numbers row
  '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index',
  '5': 'left-index', '6': 'right-index', '7': 'right-index', '8': 'right-middle',
  '9': 'right-ring', '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',
  '!': 'left-pinky', '@': 'left-ring', '#': 'left-middle', '$': 'left-index',
  '%': 'left-index', '^': 'right-index', '&': 'right-index', '*': 'right-middle',
  '(': 'right-ring', ')': 'right-pinky', '_': 'right-pinky', '+': 'right-pinky',
  // Top row
  'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index',
  't': 'left-index', 'y': 'right-index', 'u': 'right-index', 'i': 'right-middle',
  'o': 'right-ring', 'p': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky',
  '{': 'right-pinky', '}': 'right-pinky', '|': 'right-pinky', '\\': 'right-pinky',
  // Home row
  'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index',
  'g': 'left-index', 'h': 'right-index', 'j': 'right-index', 'k': 'right-middle',
  'l': 'right-ring', ';': 'right-pinky', "'": 'right-pinky', '"': 'right-pinky',
  ':': 'right-pinky',
  // Bottom row
  'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index',
  'b': 'left-index', 'n': 'right-index', 'm': 'right-index', ',': 'right-middle',
  '.': 'right-ring', '/': 'right-pinky', '<': 'right-middle', '>': 'right-ring',
  '?': 'right-pinky',
  // Special
  ' ': 'thumb', '~': 'left-pinky', '`': 'left-pinky',
};

export const FINGER_DISPLAY_NAMES: Record<string, string> = {
  'left-pinky':   'L. Pinky',
  'left-ring':    'L. Ring',
  'left-middle':  'L. Middle',
  'left-index':   'L. Index',
  'right-index':  'R. Index',
  'right-middle': 'R. Middle',
  'right-ring':   'R. Ring',
  'right-pinky':  'R. Pinky',
  'thumb':        'Thumbs',
};

// ─── Home Row Keys ────────────────────────────────────────────────
const L5_KEYS  = ['a', 's', 'd', 'f'];
const L6_KEYS  = ['j', 'k', 'l', ';'];
const L8_KEYS  = [...L5_KEYS, 'g'];
const L9_KEYS  = [...L6_KEYS, 'h'];
const L10_KEYS = [...L5_KEYS, 'g', 'h', ...L6_KEYS];

// Top Row Keys
const L15_KEYS = ['q', 'w', 'e', 'r'];
const L16_KEYS = ['u', 'i', 'o', 'p'];
const L18_KEYS = [...L15_KEYS, 't'];
const L19_KEYS = [...L16_KEYS, 'y'];
const L20_KEYS = [...L15_KEYS, 't', 'y', ...L16_KEYS];

// Bottom Row Keys
const L29_KEYS = ['z', 'x', 'c', 'v'];
const L30_KEYS = ['m', ',', '.', '/'];
const L32_KEYS = [...L29_KEYS, 'b'];
const L33_KEYS = [...L30_KEYS, 'n'];
const L34_KEYS = [...L29_KEYS, 'b', 'n', ...L30_KEYS];

// Drills
const L21_KEYS = [...L10_KEYS, 'r', 'u', 'e', 'i'];
const L22_KEYS = [...L21_KEYS, 'w', 'o', 'q', 'p'];
const L23_KEYS = [...L10_KEYS, ...L20_KEYS];
const L24_KEYS = L23_KEYS;
const L35_KEYS = [...L23_KEYS, 'v', 'm'];
const L36_KEYS = [...L35_KEYS, 'b', 'n'];
const L37_KEYS = L36_KEYS;
const L38_KEYS = [...L24_KEYS, ...L34_KEYS];
const L39_KEYS = L38_KEYS;

// Number keys
const L40_KEYS = ['1', '2', '3', '4'];
const L41_KEYS = ['7', '8', '9', '0'];
const L42_KEYS = [...L40_KEYS, ...L41_KEYS];
const L43_KEYS = [...L42_KEYS, '5', '6'];

// Symbol keys
const L44_KEYS = ['!', '@', '#', '$'];
const L45_KEYS = ['&', '*', '(', ')'];
const L46_KEYS = [...L44_KEYS, ...L45_KEYS];
const L47_KEYS = ['^', '&', '_', '-'];
const L48_KEYS = ['~', '`', '+', '='];
const L50_KEYS = ['{', '[', '}', ']'];
const L51_KEYS = ['|', '\\', ':', ';'];
const L52_KEYS = ['<', ',', '>', '.'];
const L53_KEYS = ['"', "'", '?', '/'];
const L54_KEYS = [...L50_KEYS, ...L51_KEYS];
const L55_KEYS = [...L52_KEYS, ...L53_KEYS];
const L56_KEYS = [...L54_KEYS, ...L55_KEYS];

// ─── Lessons Array ────────────────────────────────────────────────

export const LESSONS: Lesson[] = [
  // ── BEGINNER: Home Row Pairs ──────────────────────────────────
  {
    id: 1, level: 1, title: 'F and J Keys', subtitle: 'Your anchor fingers',
    keys: ['f', 'j'], allKeys: ['f', 'j'],
    type: 'keys', difficulty: 'beginner', target_wpm: 8, target_accuracy: 80, xp: 50,
    description: 'Feel the bumps! F and J are your index fingers. These dots are your home position.',
    fingerHints: { 'f': 'Left Index', 'j': 'Right Index' },
  },
  {
    id: 2, level: 2, title: 'D and K Keys', subtitle: 'Middle fingers join',
    keys: ['d', 'k'], allKeys: ['d', 'k', 'f', 'j'],
    type: 'keys', difficulty: 'beginner', target_wpm: 10, target_accuracy: 80, xp: 50,
    description: 'Add your middle fingers. D is left middle, K is right middle.',
    fingerHints: { 'd': 'Left Middle', 'k': 'Right Middle' },
  },
  {
    id: 3, level: 3, title: 'S and L Keys', subtitle: 'Ring fingers activate',
    keys: ['s', 'l'], allKeys: ['s', 'l', 'd', 'k', 'f', 'j'],
    type: 'keys', difficulty: 'beginner', target_wpm: 10, target_accuracy: 80, xp: 50,
    description: 'Ring fingers on S and L. Keep your other fingers resting on home position.',
    fingerHints: { 's': 'Left Ring', 'l': 'Right Ring' },
  },
  {
    id: 4, level: 4, title: 'A and ; Keys', subtitle: 'Pinkies complete the row',
    keys: ['a', ';'], allKeys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j'],
    type: 'keys', difficulty: 'beginner', target_wpm: 10, target_accuracy: 80, xp: 50,
    description: 'Pinkies on A and semicolon. The full home row is now accessible!',
    fingerHints: { 'a': 'Left Pinky', ';': 'Right Pinky' },
  },
  {
    id: 5, level: 5, title: 'Left Home Row', subtitle: 'A S D F together',
    keys: L5_KEYS, allKeys: L5_KEYS,
    type: 'keys', difficulty: 'beginner', target_wpm: 12, target_accuracy: 80, xp: 75,
    description: 'Master the left side: A (pinky), S (ring), D (middle), F (index).',
    fingerHints: { 'a': 'Left Pinky', 's': 'Left Ring', 'd': 'Left Middle', 'f': 'Left Index' },
  },
  {
    id: 6, level: 6, title: 'Right Home Row', subtitle: 'J K L ; together',
    keys: L6_KEYS, allKeys: L6_KEYS,
    type: 'keys', difficulty: 'beginner', target_wpm: 12, target_accuracy: 80, xp: 75,
    description: 'Master the right side: J (index), K (middle), L (ring), ; (pinky).',
    fingerHints: { 'j': 'Right Index', 'k': 'Right Middle', 'l': 'Right Ring', ';': 'Right Pinky' },
  },
  {
    id: 7, level: 7, title: 'G and H Keys', subtitle: 'Center keys — reach inward',
    keys: ['g', 'h'], allKeys: ['g', 'h', ...L5_KEYS, ...L6_KEYS],
    type: 'keys', difficulty: 'beginner', target_wpm: 12, target_accuracy: 80, xp: 75,
    description: 'G is typed by your LEFT index stretching right. H by your RIGHT index stretching left.',
    fingerHints: { 'g': 'Left Index (stretch)', 'h': 'Right Index (stretch)' },
  },
  {
    id: 8, level: 8, title: 'Left Home + G', subtitle: 'ASDFG practice',
    keys: L8_KEYS, allKeys: L8_KEYS,
    type: 'keys', difficulty: 'beginner', target_wpm: 14, target_accuracy: 82, xp: 80,
    description: 'Extend the left home row with G. Index finger reaches slightly right.',
    fingerHints: { 'a': 'L. Pinky', 's': 'L. Ring', 'd': 'L. Middle', 'f': 'L. Index', 'g': 'L. Index' },
  },
  {
    id: 9, level: 9, title: 'Right Home + H', subtitle: 'HJKL; practice',
    keys: L9_KEYS, allKeys: L9_KEYS,
    type: 'keys', difficulty: 'beginner', target_wpm: 14, target_accuracy: 82, xp: 80,
    description: 'Extend the right home row with H. Index finger reaches slightly left.',
    fingerHints: { 'h': 'R. Index', 'j': 'R. Index', 'k': 'R. Middle', 'l': 'R. Ring', ';': 'R. Pinky' },
  },
  {
    id: 10, level: 10, title: 'Full Home Row', subtitle: 'ASDFGHJKL; — Master test',
    keys: L10_KEYS, allKeys: L10_KEYS,
    type: 'test', difficulty: 'beginner', target_wpm: 15, target_accuracy: 85, xp: 150,
    description: 'This is your foundation. Pass this test to unlock the Top Row!',
    fingerHints: {},
  },
  // ── Top Row Pairs ─────────────────────────────────────────────
  {
    id: 11, level: 11, title: 'R and U Keys', subtitle: 'Index fingers go up',
    keys: ['r', 'u'], allKeys: [...L10_KEYS, 'r', 'u'],
    type: 'keys', difficulty: 'beginner', target_wpm: 14, target_accuracy: 80, xp: 75,
    description: 'R is typed by your LEFT index reaching up. U by your RIGHT index reaching up.',
    fingerHints: { 'r': 'Left Index (up)', 'u': 'Right Index (up)' },
  },
  {
    id: 12, level: 12, title: 'E and I Keys', subtitle: 'Middle fingers go up',
    keys: ['e', 'i'], allKeys: [...L10_KEYS, 'r', 'u', 'e', 'i'],
    type: 'keys', difficulty: 'beginner', target_wpm: 14, target_accuracy: 80, xp: 75,
    description: 'E is your LEFT middle finger. I is your RIGHT middle finger.',
    fingerHints: { 'e': 'Left Middle (up)', 'i': 'Right Middle (up)' },
  },
  {
    id: 13, level: 13, title: 'W and O Keys', subtitle: 'Ring fingers rise',
    keys: ['w', 'o'], allKeys: [...L10_KEYS, 'r', 'u', 'e', 'i', 'w', 'o'],
    type: 'keys', difficulty: 'beginner', target_wpm: 14, target_accuracy: 80, xp: 75,
    description: 'W is your LEFT ring finger. O is your RIGHT ring finger.',
    fingerHints: { 'w': 'Left Ring (up)', 'o': 'Right Ring (up)' },
  },
  {
    id: 14, level: 14, title: 'Q and P Keys', subtitle: 'Pinkies on the top row',
    keys: ['q', 'p'], allKeys: [...L10_KEYS, 'r', 'u', 'e', 'i', 'w', 'o', 'q', 'p'],
    type: 'keys', difficulty: 'beginner', target_wpm: 13, target_accuracy: 80, xp: 75,
    description: 'Q is your LEFT pinky reaching up. P is your RIGHT pinky reaching up.',
    fingerHints: { 'q': 'Left Pinky (up)', 'p': 'Right Pinky (up)' },
  },
  {
    id: 15, level: 15, title: 'Left Top Row', subtitle: 'Q W E R — left side mastery',
    keys: L15_KEYS, allKeys: [...L10_KEYS, ...L15_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 15, target_accuracy: 82, xp: 100,
    description: 'Practice Q W E R together. These are the most common letters in English!',
    fingerHints: { 'q': 'L. Pinky', 'w': 'L. Ring', 'e': 'L. Middle', 'r': 'L. Index' },
  },
  {
    id: 16, level: 16, title: 'Right Top Row', subtitle: 'U I O P — right side mastery',
    keys: L16_KEYS, allKeys: [...L10_KEYS, ...L16_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 15, target_accuracy: 82, xp: 100,
    description: 'Master U I O P together. Many vowels live here!',
    fingerHints: { 'u': 'R. Index', 'i': 'R. Middle', 'o': 'R. Ring', 'p': 'R. Pinky' },
  },
  {
    id: 17, level: 17, title: 'T and Y Keys', subtitle: 'Center top keys',
    keys: ['t', 'y'], allKeys: [...L10_KEYS, ...L15_KEYS, ...L16_KEYS, 't', 'y'],
    type: 'keys', difficulty: 'intermediate', target_wpm: 15, target_accuracy: 82, xp: 100,
    description: 'T extends left index finger. Y extends right index finger. Critical letters!',
    fingerHints: { 't': 'Left Index (up-center)', 'y': 'Right Index (up-center)' },
  },
  {
    id: 18, level: 18, title: 'Left Top + T', subtitle: 'QWERT mastery',
    keys: L18_KEYS, allKeys: [...L10_KEYS, ...L18_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 16, target_accuracy: 83, xp: 100,
    description: 'The full left side of the top row. T is reached by stretching your index finger right.',
    fingerHints: { 'q': 'L. Pinky', 'w': 'L. Ring', 'e': 'L. Middle', 'r': 'L. Index', 't': 'L. Index' },
  },
  {
    id: 19, level: 19, title: 'Right Top + Y', subtitle: 'YUIOP mastery',
    keys: L19_KEYS, allKeys: [...L10_KEYS, ...L19_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 16, target_accuracy: 83, xp: 100,
    description: 'The full right side of the top row. Y is reached by stretching your right index left.',
    fingerHints: { 'y': 'R. Index', 'u': 'R. Index', 'i': 'R. Middle', 'o': 'R. Ring', 'p': 'R. Pinky' },
  },
  {
    id: 20, level: 20, title: 'Full Top Row', subtitle: 'QWERTY complete — Master test',
    keys: L20_KEYS, allKeys: L20_KEYS,
    type: 'test', difficulty: 'intermediate', target_wpm: 18, target_accuracy: 85, xp: 200,
    description: 'The complete top row test. Prove your mastery to unlock bottom row training!',
    fingerHints: {},
  },
  // ── Combination Drills ─────────────────────────────────────────
  {
    id: 21, level: 21, title: 'Home + R U E I', subtitle: 'First combo drill',
    keys: ['r', 'u', 'e', 'i'], allKeys: L21_KEYS,
    type: 'drill', difficulty: 'intermediate', target_wpm: 18, target_accuracy: 83, xp: 120,
    description: 'Mix home row with the most common top row vowels and consonants.',
    fingerHints: {},
  },
  {
    id: 22, level: 22, title: 'Add W O Q P', subtitle: 'More top row combination',
    keys: ['w', 'o', 'q', 'p'], allKeys: L22_KEYS,
    type: 'drill', difficulty: 'intermediate', target_wpm: 18, target_accuracy: 83, xp: 120,
    description: 'Expand your vocabulary with W, O, Q, P added to the mix.',
    fingerHints: {},
  },
  {
    id: 23, level: 23, title: 'Home + Top Row', subtitle: 'Full 2-row drill',
    keys: L20_KEYS, allKeys: L23_KEYS,
    type: 'drill', difficulty: 'intermediate', target_wpm: 20, target_accuracy: 85, xp: 150,
    description: 'All home row and top row keys combined. Real words emerge!',
    fingerHints: {},
  },
  {
    id: 24, level: 24, title: '2-Row Endurance', subtitle: 'Speed drill',
    keys: L24_KEYS, allKeys: L24_KEYS,
    type: 'challenge', difficulty: 'intermediate', target_wpm: 22, target_accuracy: 85, xp: 175,
    description: 'Push your speed with home + top rows. Focus on rhythm not individual keys.',
    fingerHints: {},
  },
  // ── Bottom Row ─────────────────────────────────────────────────
  {
    id: 25, level: 25, title: 'V and M Keys', subtitle: 'Index fingers go down',
    keys: ['v', 'm'], allKeys: [...L24_KEYS, 'v', 'm'],
    type: 'keys', difficulty: 'intermediate', target_wpm: 16, target_accuracy: 80, xp: 100,
    description: 'V is LEFT index going down-right. M is RIGHT index going down-left.',
    fingerHints: { 'v': 'Left Index (down)', 'm': 'Right Index (down)' },
  },
  {
    id: 26, level: 26, title: 'C and , Keys', subtitle: 'Middle fingers go down',
    keys: ['c', ','], allKeys: [...L24_KEYS, 'v', 'm', 'c', ','],
    type: 'keys', difficulty: 'intermediate', target_wpm: 16, target_accuracy: 80, xp: 100,
    description: 'C is your LEFT middle finger. Comma is your RIGHT middle finger.',
    fingerHints: { 'c': 'Left Middle (down)', ',': 'Right Middle (down)' },
  },
  {
    id: 27, level: 27, title: 'X and . Keys', subtitle: 'Ring fingers go down',
    keys: ['x', '.'], allKeys: [...L24_KEYS, 'v', 'm', 'c', ',', 'x', '.'],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 100,
    description: 'X is your LEFT ring finger. Period is your RIGHT ring finger.',
    fingerHints: { 'x': 'Left Ring (down)', '.': 'Right Ring (down)' },
  },
  {
    id: 28, level: 28, title: 'Z and / Keys', subtitle: 'Pinkies on bottom row',
    keys: ['z', '/'], allKeys: [...L24_KEYS, 'v', 'm', 'c', ',', 'x', '.', 'z', '/'],
    type: 'keys', difficulty: 'intermediate', target_wpm: 12, target_accuracy: 78, xp: 100,
    description: 'Z is LEFT pinky going down. Forward slash is RIGHT pinky.',
    fingerHints: { 'z': 'Left Pinky (down)', '/': 'Right Pinky (down)' },
  },
  {
    id: 29, level: 29, title: 'Left Bottom Row', subtitle: 'Z X C V together',
    keys: L29_KEYS, allKeys: [...L24_KEYS, ...L29_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 110,
    description: 'The left bottom row: Z (pinky), X (ring), C (middle), V (index).',
    fingerHints: { 'z': 'L. Pinky', 'x': 'L. Ring', 'c': 'L. Middle', 'v': 'L. Index' },
  },
  {
    id: 30, level: 30, title: 'Right Bottom Row', subtitle: 'M , . / together',
    keys: L30_KEYS, allKeys: [...L24_KEYS, ...L30_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 110,
    description: 'The right bottom row: M (index), comma (middle), period (ring), / (pinky).',
    fingerHints: { 'm': 'R. Index', ',': 'R. Middle', '.': 'R. Ring', '/': 'R. Pinky' },
  },
  {
    id: 31, level: 31, title: 'B and N Keys', subtitle: 'Center bottom keys',
    keys: ['b', 'n'], allKeys: [...L24_KEYS, ...L29_KEYS, ...L30_KEYS, 'b', 'n'],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 110,
    description: 'B is LEFT index stretching down-right. N is RIGHT index stretching down-left.',
    fingerHints: { 'b': 'Left Index (down-center)', 'n': 'Right Index (down-center)' },
  },
  {
    id: 32, level: 32, title: 'Left Bottom + B', subtitle: 'ZXCVB practice',
    keys: L32_KEYS, allKeys: [...L24_KEYS, ...L32_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 110,
    description: 'Complete the left bottom: add B to your ZXCV foundation.',
    fingerHints: { 'z': 'L. Pinky', 'x': 'L. Ring', 'c': 'L. Middle', 'v': 'L. Index', 'b': 'L. Index' },
  },
  {
    id: 33, level: 33, title: 'Right Bottom + N', subtitle: 'NM,. practice',
    keys: L33_KEYS, allKeys: [...L24_KEYS, ...L33_KEYS],
    type: 'keys', difficulty: 'intermediate', target_wpm: 14, target_accuracy: 80, xp: 110,
    description: 'Complete the right bottom: add N to your M,./ foundation.',
    fingerHints: { 'n': 'R. Index', 'm': 'R. Index', ',': 'R. Middle', '.': 'R. Ring', '/': 'R. Pinky' },
  },
  {
    id: 34, level: 34, title: 'Full Bottom Row', subtitle: 'ZXCVBNM,. — Master test',
    keys: L34_KEYS, allKeys: L34_KEYS,
    type: 'test', difficulty: 'intermediate', target_wpm: 16, target_accuracy: 83, xp: 200,
    description: 'The full bottom row test. Pass to unlock full 3-row combination drills!',
    fingerHints: {},
  },
  // ── Big Drills ─────────────────────────────────────────────────
  {
    id: 35, level: 35, title: '2-Row + V M', subtitle: 'Expanding downward',
    keys: ['v', 'm'], allKeys: L35_KEYS,
    type: 'drill', difficulty: 'advanced', target_wpm: 20, target_accuracy: 84, xp: 150,
    description: 'Add bottom row index keys to your 2-row foundation.',
    fingerHints: {},
  },
  {
    id: 36, level: 36, title: 'Add B and N', subtitle: '3-row center keys',
    keys: ['b', 'n'], allKeys: L36_KEYS,
    type: 'drill', difficulty: 'advanced', target_wpm: 22, target_accuracy: 84, xp: 150,
    description: 'B and N are critical — they appear in hundreds of common English words.',
    fingerHints: {},
  },
  {
    id: 37, level: 37, title: '3-Row Core Drill', subtitle: 'Speed challenge',
    keys: L37_KEYS, allKeys: L37_KEYS,
    type: 'challenge', difficulty: 'advanced', target_wpm: 25, target_accuracy: 85, xp: 200,
    description: 'Push your speed across all three rows. Aim for smooth, flowing rhythm.',
    fingerHints: {},
  },
  {
    id: 38, level: 38, title: '2-Row + Full Bottom', subtitle: 'Almost complete',
    keys: L34_KEYS, allKeys: L38_KEYS,
    type: 'drill', difficulty: 'advanced', target_wpm: 22, target_accuracy: 84, xp: 175,
    description: 'Add all bottom row keys to your home + top row foundation.',
    fingerHints: {},
  },
  {
    id: 39, level: 39, title: 'Full Alphabet Mastery', subtitle: 'All 26 letters — the big test',
    keys: L39_KEYS, allKeys: L39_KEYS,
    type: 'test', difficulty: 'advanced', target_wpm: 28, target_accuracy: 87, xp: 300,
    description: 'All 26 letters of the alphabet. This is the milestone before numbers and symbols!',
    fingerHints: {},
  },
  // ── Numbers ───────────────────────────────────────────────────
  {
    id: 40, level: 40, title: '1 2 3 4 Keys', subtitle: 'Left side numbers',
    keys: L40_KEYS, allKeys: L40_KEYS,
    type: 'keys', difficulty: 'advanced', target_wpm: 12, target_accuracy: 78, xp: 125,
    description: '1 (pinky), 2 (ring), 3 (middle), 4 (index). Keep home row anchors!',
    fingerHints: { '1': 'L. Pinky', '2': 'L. Ring', '3': 'L. Middle', '4': 'L. Index' },
  },
  {
    id: 41, level: 41, title: '7 8 9 0 Keys', subtitle: 'Right side numbers',
    keys: L41_KEYS, allKeys: L41_KEYS,
    type: 'keys', difficulty: 'advanced', target_wpm: 12, target_accuracy: 78, xp: 125,
    description: '7 (index), 8 (middle), 9 (ring), 0 (pinky). Mirror your left hand numbers.',
    fingerHints: { '7': 'R. Index', '8': 'R. Middle', '9': 'R. Ring', '0': 'R. Pinky' },
  },
  {
    id: 42, level: 42, title: '1234 + 7890', subtitle: 'Numbers without 5 6',
    keys: L42_KEYS, allKeys: L42_KEYS,
    type: 'drill', difficulty: 'advanced', target_wpm: 14, target_accuracy: 80, xp: 150,
    description: 'Combine outer numbers. These are the most frequently typed numbers.',
    fingerHints: {},
  },
  {
    id: 43, level: 43, title: 'Full Number Row', subtitle: '1-0 complete',
    keys: ['5', '6'], allKeys: L43_KEYS,
    type: 'test', difficulty: 'advanced', target_wpm: 15, target_accuracy: 82, xp: 200,
    description: 'Add 5 (left index) and 6 (right index) to complete the number row!',
    fingerHints: { '5': 'L. Index (stretch up)', '6': 'R. Index (stretch up)' },
  },
  // ── Symbols ───────────────────────────────────────────────────
  {
    id: 44, level: 44, title: '! @ # $ Keys', subtitle: 'Shift + 1 2 3 4',
    keys: L44_KEYS, allKeys: L44_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Hold Shift with your right pinky while pressing 1-4 with your left hand.',
    fingerHints: { '!': 'L. Pinky + R. Shift', '@': 'L. Ring + R. Shift', '#': 'L. Middle + R. Shift', '$': 'L. Index + R. Shift' },
  },
  {
    id: 45, level: 45, title: '& * ( ) Keys', subtitle: 'Shift + 7 8 9 0',
    keys: L45_KEYS, allKeys: L45_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Hold Shift with left pinky while pressing 7-0 with your right hand.',
    fingerHints: { '&': 'R. Index + L. Shift', '*': 'R. Middle + L. Shift', '(': 'R. Ring + L. Shift', ')': 'R. Pinky + L. Shift' },
  },
  {
    id: 46, level: 46, title: '!@#$ + &*() Drill', subtitle: 'Shift symbols combined',
    keys: L46_KEYS, allKeys: L46_KEYS,
    type: 'drill', difficulty: 'expert', target_wpm: 12, target_accuracy: 78, xp: 175,
    description: 'Combine shift-number symbols. Essential for passwords and code!',
    fingerHints: {},
  },
  {
    id: 47, level: 47, title: '^ & _ - Keys', subtitle: 'More shift symbols',
    keys: L47_KEYS, allKeys: L47_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Caret (Shift+6), underscore (Shift+-), and hyphen. Common in variable names!',
    fingerHints: { '^': 'R. Index + L. Shift', '_': 'R. Pinky + L. Shift', '-': 'R. Pinky' },
  },
  {
    id: 48, level: 48, title: '~ ` + = Keys', subtitle: 'Backtick and equals',
    keys: L48_KEYS, allKeys: L48_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Backtick and tilde are L. Pinky. Plus (Shift+=) and equals are R. Pinky.',
    fingerHints: { '~': 'L. Pinky + R. Shift', '`': 'L. Pinky', '+': 'R. Pinky + L. Shift', '=': 'R. Pinky' },
  },
  {
    id: 49, level: 49, title: 'Shift + Numbers', subtitle: 'Full symbol number row',
    keys: [...L44_KEYS, ...L45_KEYS, ...L47_KEYS, ...L48_KEYS],
    allKeys: [...L44_KEYS, ...L45_KEYS, ...L47_KEYS, ...L48_KEYS],
    type: 'test', difficulty: 'expert', target_wpm: 12, target_accuracy: 78, xp: 250,
    description: 'Test all shift+number symbols. A key milestone for programmers!',
    fingerHints: {},
  },
  // ── Special Chars ────────────────────────────────────────────
  {
    id: 50, level: 50, title: '{ [ } ] Keys', subtitle: 'Bracket family',
    keys: L50_KEYS, allKeys: L50_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Brackets [ ] are R. Pinky. Braces { } are Shift+[ and Shift+]. Critical for code!',
    fingerHints: { '[': 'R. Pinky', ']': 'R. Pinky', '{': 'R. Pinky + L. Shift', '}': 'R. Pinky + L. Shift' },
  },
  {
    id: 51, level: 51, title: '| \\ : ; Keys', subtitle: 'Pipe, backslash, colon',
    keys: L51_KEYS, allKeys: L51_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Backslash and pipe are R. Pinky. Colon (Shift+;) is also R. Pinky. Semicolon is home!',
    fingerHints: { '|': 'R. Pinky + L. Shift', '\\': 'R. Pinky', ':': 'R. Pinky + L. Shift', ';': 'R. Pinky' },
  },
  {
    id: 52, level: 52, title: '< , > . Keys', subtitle: 'Angle brackets',
    keys: L52_KEYS, allKeys: L52_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Comma and period are home. < is Shift+, and > is Shift+. — Used in HTML/JSX!',
    fingerHints: { '<': 'R. Middle + L. Shift', ',': 'R. Middle', '>': 'R. Ring + L. Shift', '.': 'R. Ring' },
  },
  {
    id: 53, level: 53, title: '" \' ? / Keys', subtitle: 'Quote and question marks',
    keys: L53_KEYS, allKeys: L53_KEYS,
    type: 'keys', difficulty: 'expert', target_wpm: 10, target_accuracy: 75, xp: 150,
    description: 'Single quote and double quote (Shift+\') are R. Pinky. Question mark (Shift+/) is also R. Pinky.',
    fingerHints: { '"': 'R. Pinky + L. Shift', "'": 'R. Pinky', '?': 'R. Pinky + L. Shift', '/': 'R. Pinky' },
  },
  {
    id: 54, level: 54, title: 'Brackets + Pipe', subtitle: '{ [ } ] | \\ : ; drill',
    keys: L54_KEYS, allKeys: L54_KEYS,
    type: 'drill', difficulty: 'expert', target_wpm: 12, target_accuracy: 78, xp: 200,
    description: 'Combine bracket and pipe family keys. Essential for coding fluency!',
    fingerHints: {},
  },
  {
    id: 55, level: 55, title: 'Angles + Quotes', subtitle: '< > " \' ? / drill',
    keys: L55_KEYS, allKeys: L55_KEYS,
    type: 'drill', difficulty: 'expert', target_wpm: 12, target_accuracy: 78, xp: 200,
    description: 'Combine angle brackets and quote marks. Used in every programming language!',
    fingerHints: {},
  },
  {
    id: 56, level: 56, title: 'Full Symbol Mastery', subtitle: 'All special characters — FINAL TEST',
    keys: L56_KEYS, allKeys: L56_KEYS,
    type: 'test', difficulty: 'expert', target_wpm: 15, target_accuracy: 80, xp: 500,
    description: 'The final challenge. All special characters combined. You are now a complete typist!',
    fingerHints: {},
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

export function getLessonById(id: number): Lesson | undefined {
  return LESSONS.find(l => l.id === id);
}

export function getDifficultyColor(diff: Difficulty): string {
  switch (diff) {
    case 'beginner':     return '#4ade80';
    case 'intermediate': return '#facc15';
    case 'advanced':     return '#fb923c';
    case 'expert':       return '#f87171';
    default:             return '#94a3b8';
  }
}

export const DIFFICULTY_GROUPS: { label: string; difficulty: Difficulty; range: [number, number] }[] = [
  { label: 'Beginner',     difficulty: 'beginner',     range: [1, 10] },
  { label: 'Intermediate', difficulty: 'intermediate', range: [11, 24] },
  { label: 'Advanced',     difficulty: 'advanced',     range: [25, 39] },
  { label: 'Expert',       difficulty: 'expert',       range: [40, 56] },
];
