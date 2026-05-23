import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { quotes as localQuotes } from '@/app/practice/words';

// ── Punctuation Engine (MonkeyType-style) ──────────────────────
function applyPunctuation(words: string[]): string[] {
  const result: string[] = [];
  let sentenceLength = 0;
  const targetSentenceLen = () => Math.floor(Math.random() * 8) + 3; // 3-10 words per sentence
  let currentTarget = targetSentenceLen();
  let isNewSentence = true;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // Capitalize first word of every sentence
    if (isNewSentence) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
      isNewSentence = false;
    }

    sentenceLength++;

    // End of sentence
    if (sentenceLength >= currentTarget && i < words.length - 1) {
      const endPunct = Math.random();
      if (endPunct < 0.75) word += '.';
      else if (endPunct < 0.90) word += '?';
      else word += '!';
      isNewSentence = true;
      sentenceLength = 0;
      currentTarget = targetSentenceLen();
      result.push(word);
      continue;
    }

    // Mid-sentence modifications (only if not ending sentence)
    const midRand = Math.random();
    if (midRand < 0.08 && sentenceLength > 1) {
      // 8% comma
      word += ',';
    } else if (midRand < 0.11) {
      // 3% semicolon
      word += ';';
    } else if (midRand < 0.13) {
      // 2% colon
      word += ':';
    } else if (midRand < 0.16) {
      // 3% parentheses wrap
      word = `(${word})`;
    } else if (midRand < 0.18) {
      // 2% quotes wrap
      word = `"${word}"`;
    } else if (midRand < 0.22) {
      // 4% contraction - replace word with a common contraction
      const contractions = [
        "it's", "I'm", "don't", "can't", "won't", "I'd", "he'd", "she'd",
        "they're", "we're", "you're", "isn't", "aren't", "wasn't", "weren't",
        "I've", "you've", "we've", "they've", "I'll", "you'll", "he'll",
        "she'll", "we'll", "they'll", "must've", "should've", "would've",
        "couldn't", "wouldn't", "shouldn't", "didn't", "hasn't", "haven't",
        "let's", "that's", "what's", "who's", "there's", "here's"
      ];
      word = contractions[Math.floor(Math.random() * contractions.length)];
    } else if (midRand < 0.24) {
      // 2% dash
      word += ' -';
    }

    result.push(word);
  }

  // Ensure last word ends with period
  if (result.length > 0) {
    let lastWord = result[result.length - 1];
    const lastChar = lastWord[lastWord.length - 1];
    if (lastChar !== '.' && lastChar !== '?' && lastChar !== '!') {
      lastWord += '.';
    }
    result[result.length - 1] = lastWord;
  }

  return result;
}

// ── Number Injection Engine ────────────────────────────────────
function applyNumbers(words: string[]): string[] {
  return words.map(w => {
    const rand = Math.random();
    if (rand < 0.06) {
      // 6% → replace with a random number (1-3 digits)
      const digits = Math.floor(Math.random() * 3) + 1;
      const num = Math.floor(Math.random() * Math.pow(10, digits));
      return num.toString();
    }
    if (rand < 0.10) {
      // 4% → replace with a realistic number
      const realistic = [
        '42', '100', '365', '1000', '99', '7', '13', '256', '512', '1024',
        '2024', '2025', '404', '500', '3.14', '99.9', '50', '75', '180', '360'
      ];
      return realistic[Math.floor(Math.random() * realistic.length)];
    }
    return w;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'words';
  const count = parseInt(searchParams.get('count') || '50', 10);
  const punctuation = searchParams.get('punctuation') === 'true';
  const numbers = searchParams.get('numbers') === 'true';
  const quoteLength = searchParams.get('quoteLength') || 'all';

  try {
    // ── Quote Mode: return a random quote ──
    if (mode === 'quote') {
      const filtered = quoteLength === 'all' 
        ? localQuotes 
        : localQuotes.filter(q => q.length === quoteLength);
      const selected = filtered[Math.floor(Math.random() * filtered.length)];
      return NextResponse.json({ 
        words: selected.text.split(' '),
        source: selected.source,
        quoteLength: selected.length,
      });
    }

    // ── Standard Modes: fetch from DB word pools ──
    const poolCount = await prisma.wordPool.count();
    
    if (poolCount === 0) {
      // Fallback word list
      const fallbackWords = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
        "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
        "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
        "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
        "when", "make", "can", "like", "time", "no", "just", "him", "know",
        "take", "people", "into", "year", "your", "good", "some", "could",
        "them", "see", "other", "than", "then", "now", "look", "only", "come",
        "its", "over", "think", "also", "back", "after", "use", "two", "how",
        "our", "work", "first", "well", "way", "even", "new", "want", "because",
        "any", "these", "give", "day", "most", "us", "great", "between", "need",
        "large", "must", "big", "end", "point", "home", "world", "head", "long",
        "program", "run", "find", "course", "hand", "old", "both", "high", "each",
        "tell", "around", "follow", "ask", "men", "form", "small", "place", "every",
        "problem", "stand", "own", "still", "learn", "late", "interest", "much",
        "real", "few", "right", "down", "lead", "another", "turn", "number",
        "public", "many", "fact", "increase", "order", "thing", "person", "leave",
        "word", "write", "since", "against", "show", "consider", "may", "hold"
      ];
      
      let resultWords: string[] = [];
      const shuffled = [...fallbackWords].sort(() => Math.random() - 0.5);
      while (resultWords.length < count) {
        resultWords.push(...shuffled.sort(() => Math.random() - 0.5));
      }
      resultWords = resultWords.slice(0, count);

      if (punctuation) resultWords = applyPunctuation(resultWords);
      if (numbers) resultWords = applyNumbers(resultWords);

      return NextResponse.json({ words: resultWords });
    }

    // Fetch from multiple DB pools for variety
    const pools = await prisma.wordPool.findMany({
      take: Math.min(5, poolCount),
      skip: Math.floor(Math.random() * Math.max(1, poolCount - 5)),
    });

    let allPoolWords: string[] = [];
    for (const pool of pools) {
      allPoolWords.push(...pool.words);
    }

    // Shuffle and pick
    allPoolWords = allPoolWords.sort(() => Math.random() - 0.5);
    
    let resultWords: string[] = [];
    while (resultWords.length < count) {
      resultWords.push(...allPoolWords.sort(() => Math.random() - 0.5));
    }
    resultWords = resultWords.slice(0, count);

    // Apply modifications (but rarely or not at all in zen mode if you want pure random typing without paragraphs)
    if (punctuation && mode !== 'zen') resultWords = applyPunctuation(resultWords);
    if (numbers) resultWords = applyNumbers(resultWords);

    return NextResponse.json({ 
      words: resultWords,
      poolName: pools[0]?.name,
      category: pools[0]?.category
    });

  } catch (e) {
    console.error('API Error:', e);
    const fallback = ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "cat"];
    let resultWords = [...fallback];
    while (resultWords.length < count) resultWords.push(...fallback);
    resultWords = resultWords.slice(0, count).sort(() => Math.random() - 0.5);
    
    if (punctuation && mode !== 'zen') resultWords = applyPunctuation(resultWords);
    if (numbers) resultWords = applyNumbers(resultWords);
    
    return NextResponse.json({ words: resultWords });
  }
}
