// Predefined common English words
export const commonWords = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", 
  "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", 
  "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", 
  "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", 
  "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", 
  "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", 
  "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", 
  "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", 
  "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", 
  "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", 
  "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", 
  "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early",
  "course", "change", "help", "line", "city", "put", "close", "case", "force", "meet", "once", "water", "upon", "war", "build", "hear",
  "light", "unite", "live", "every", "country", "bring", "center", "let", "side", "try", "provide", "continue", "name", "certain", "power", "pay", 
  "result", "question", "study", "woman", "member", "until", "far", "night", "always", "service", "away", "report", "something", "company", "week"
];

// Mock hindi transliterated words 
export const hindiWords = [
  "hai", "aur", "ki", "mein", "ka", "ke", "ko", "se", "ek", "par", "hoga", "hain", "kya", "bhi", "yeh", "woh", "nahin", "jo", "hi", "kisi",
  "kar", "liye", "hota", "un", "toh", "unhone", "kuch", "apne", "saath", "kaha", "jab", "tha", "diya", "is", "wala", "baat", "unki", "tarah",
  "karenga", "apni", "raha", "baar", "karke", "ab", "hone", "hui", "mujhe", "tum", "mera", "karti", "dikha", "samay", "pehle", "baar", "aaj"
];

export const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "To be or not to be that is the question.",
  "All that glitters is not gold.",
  "A journey of a thousand miles begins with a single step.",
  "Life is what happens when you're busy making other plans.",
  "The only way to do great work is to love what you do.",
  "Imagination is more important than knowledge."
];

// Utility function to generate random text
export type GenerationOptions = {
  mode: 'time' | 'words' | 'quote' | 'zen' | 'custom';
  language?: 'english' | 'hindi';
  punctuation?: boolean;
  numbers?: boolean;
  wordCount?: number; // Used for words mode or time chunking
  customText?: string;
  delimiter?: string;
  shuffle?: boolean;
};

export function generateText(options: GenerationOptions): string[] {
  if (options.mode === 'custom' && options.customText) {
    let parts = options.customText.split(options.delimiter === 'pipe' ? '|' : ' ').filter(Boolean);
    if (options.shuffle) {
      parts = parts.sort(() => Math.random() - 0.5);
    }
    // Limit words if a wordCount limit is forced, else return all
    if (options.wordCount && parts.length > options.wordCount) {
      parts = parts.slice(0, options.wordCount);
    }
    return parts;
  }

  if (options.mode === 'quote') {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    return q.split(' ');
  }

  let dict = options.language === 'hindi' ? hindiWords : commonWords;
  let count = options.mode === 'words' && options.wordCount ? options.wordCount : 100; // For time/zen, generate 100 words at a time initially, we will replenish later
  
  if (options.mode === 'zen') {
    count = 50; // Zen mode will just replenish when running low
  }

  const generated: string[] = [];
  for (let i = 0; i < count; i++) {
    let w = dict[Math.floor(Math.random() * dict.length)];
    
    if (options.numbers && Math.random() < 0.15) {
      w = Math.floor(Math.random() * 1000).toString();
    }
    
    if (options.punctuation && Math.random() < 0.2) {
      const puncs = [".", ",", "?", "!", ";", ":", "'", '"', "-", "()"];
      const punc = puncs[Math.floor(Math.random() * puncs.length)];
      if (punc === "()") {
        w = `(${w})`;
      } else if (punc === "'" || punc === '"') {
        w = `${punc}${w}${punc}`;
      } else {
        w = `${w}${punc}`;
      }
    }
    
    generated.push(w);
  }
  return generated;
}
