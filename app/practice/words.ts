// ─── Word Pools ──────────────────────────────────────────────────

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

export const hindiWords = [
  "hai", "aur", "ki", "mein", "ka", "ke", "ko", "se", "ek", "par", "hoga", "hain", "kya", "bhi", "yeh", "woh", "nahin", "jo", "hi", "kisi",
  "kar", "liye", "hota", "un", "toh", "unhone", "kuch", "apne", "saath", "kaha", "jab", "tha", "diya", "is", "wala", "baat", "unki", "tarah",
  "karenga", "apni", "raha", "baar", "karke", "ab", "hone", "hui", "mujhe", "tum", "mera", "karti", "dikha", "samay", "pehle", "baar", "aaj"
];

// ─── Quotes Database ─────────────────────────────────────────────

export type Quote = {
  text: string;
  source: string;
  length: 'short' | 'medium' | 'long';
};

export const quotes: Quote[] = [
  // ── SHORT ──
  { text: "I believe there's a hero in all of us, that keeps us honest, gives us strength, makes us noble, and finally allows us to die with pride, even though sometimes we have to be steady and give up the thing we want the most - even our dreams.", source: "Spider-Man 2", length: "short" },
  { text: "I've decided to make myself strong. As far as I can tell, that's all I can do.", source: "Hajime no Ippo", length: "short" },
  { text: "With great power comes great responsibility. This is my gift, my curse. Who am I? I'm Spider-Man. No matter what I do, no matter how hard I try, the ones I love will always be the ones who pay.", source: "Spider-Man", length: "short" },
  { text: "Why do we fall, sir? So that we can learn to pick ourselves up. It's not who I am underneath, but what I do that defines me. The night is darkest just before the dawn, and I promise you, the dawn is coming.", source: "The Dark Knight", length: "short" },
  { text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it. The question isn't what are we going to do, the question is what aren't we going to do.", source: "Ferris Bueller's Day Off", length: "short" },
  { text: "Get busy living, or get busy dying. Every man dies, but not every man really lives. In the end, we only regret the chances we didn't take, the relationships we were afraid to have, and the decisions we waited too long to make.", source: "The Shawshank Redemption", length: "short" },
  { text: "I'm the good guy. The law is on my side. I am the law. The law is me. I work for justice. I uphold the Constitution of these United States. I am a knight for the people. I wear the white hat.", source: "Scandal", length: "short" },
  { text: "He's got to make his own mistakes and learn to mend the mess he makes. He's old enough to know what's right but young enough not to choose it. He's noble enough to win the world but weak enough to lose it.", source: "Les Misérables", length: "short" },
  { text: "May the Force be with you. Do, or do not - there is no try. Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering.", source: "Star Wars", length: "short" },
  { text: "Talk is cheap. Show me the code. Given enough eyeballs, all bugs are shallow. Most good programmers do programming not because they expect to get paid, but because it's fun to program.", source: "Linus Torvalds", length: "short" },
  { text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.", source: "Steve Jobs", length: "short" },
  { text: "You see, in this world there's two kinds of people, my friend: those with loaded guns, and those who dig. You dig. Sometimes the right path is not the easiest one.", source: "The Good, the Bad and the Ugly", length: "short" },
  { text: "After all, tomorrow is another day. It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife. All we have to decide is what to do with the time that is given to us.", source: "Classic Literature", length: "short" },
  { text: "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Simplicity is the soul of efficiency.", source: "Programming Wisdom", length: "short" },
  { text: "Oh, well since we didn't get hit by any arrows, I'll tell you a secret. Enter the forest. When you hit an area with 4 paths, go left, left, straight, right - in that order. You'll surely find what you're looking for.", source: "Hunter x Hunter", length: "short" },

  // ── MEDIUM ──
  { text: "I am Iron Man. The truth is, I am Iron Man. I know in my heart that it's right. Sometimes you gotta run before you can walk. If we can't accept limitations, then we're no better than the bad guys. Part of the journey is the end. And I am nothing without this suit. I love you three thousand.", source: "Tony Stark / Iron Man", length: "medium" },
  { text: "The world is changed. I feel it in the water. I feel it in the earth. I smell it in the air. Much that once was, is lost, for none now live who remember it. Even the smallest person can change the course of the future. All we have to decide is what to do with the time that is given to us. There's some good in this world, Mr. Frodo, and it's worth fighting for.", source: "Lord of the Rings", length: "medium" },
  { text: "Hope is a good thing, maybe the best of things, and no good thing ever dies. Get busy living, or get busy dying. I guess it comes down to a simple choice, really. Get busy living, or get busy dying. Some birds aren't meant to be caged. Their feathers are just too bright. I have to remind myself that some birds aren't meant to be caged.", source: "The Shawshank Redemption", length: "medium" },
  { text: "Life is like a box of chocolates, you never know what you're going to get. Mama always said life was like a box of chocolates. Stupid is as stupid does. My mama always said you've got to put the past behind you before you can move on. I'm not a smart man, but I know what love is.", source: "Forrest Gump", length: "medium" },
  { text: "Twenty years from now you'll be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover. It's never too late to be what you might have been. The secret of getting ahead is getting started.", source: "Mark Twain", length: "medium" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts. We make a living by what we get, but we make a life by what we give. The pessimist sees difficulty in every opportunity. The optimist sees the opportunity in every difficulty. Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.", source: "Winston Churchill", length: "medium" },
  { text: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that. The time is always right to do what is right. Our lives begin to end the day we become silent about things that matter. Injustice anywhere is a threat to justice everywhere. I have a dream that one day this nation will rise up and live out the true meaning of its creed.", source: "Martin Luther King Jr.", length: "medium" },
  { text: "You must be the change you wish to see in the world. The future depends on what you do today. Live as if you were to die tomorrow. Learn as if you were to live forever. An ounce of practice is worth more than tons of preaching. Strength does not come from physical capacity. It comes from an indomitable will. First they ignore you, then they laugh at you, then they fight you, then you win.", source: "Mahatma Gandhi", length: "medium" },
  { text: "I think everybody in this country should learn how to program a computer, because it teaches you how to think. A computer is like a violin. You can imagine a wonderful performance, and you have to practice it really hard. The people who are crazy enough to think they can change the world are the ones who do. Your time is limited, so don't waste it living someone else's life.", source: "Steve Jobs", length: "medium" },
  { text: "The function of good software is to make the complex appear to be simple. Before software can be reusable, it first has to be usable. The best error message is the one that never shows up. Make it work, make it right, make it fast. Programming isn't about typing, it's about thinking. Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", source: "Programming Wisdom", length: "medium" },
  { text: "It doesn't matter how slowly you go, as long as you don't stop. Our greatest glory is not in never falling, but in rising every time we fall. The man who moves a mountain begins by carrying away small stones. Real knowledge is to know the extent of one's ignorance. When it's obvious that the goals can't be reached, don't adjust the goals - adjust the action steps.", source: "Confucius", length: "medium" },

  // ── LONG ──
  { text: "It's not the strongest of the species that survives, nor the most intelligent that survives. It's the one that is most adaptable to change. In the long history of humankind, those who learned to collaborate and improvise most effectively have prevailed. The measure of intelligence is the ability to change. We can't solve our problems with the same thinking we used when we created them. Education is not the learning of facts, but the training of the mind to think. Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", source: "Charles Darwin & Albert Einstein", length: "long" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. It's better to be hated for what you are than to be loved for what you are not. Whenever you find yourself on the side of the majority, it's time to pause and reflect. The only person you're destined to become is the person you decide to be. Don't go where the path may lead, go instead where there's no path and leave a trail. What lies behind us and what lies before us are tiny matters compared to what lies within us.", source: "Ralph Waldo Emerson", length: "long" },
  { text: "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes, the ones who see things differently. They're not fond of rules, and they have no respect for the status quo. You can quote them, disagree with them, glorify or vilify them. About the only thing you can't do is ignore them, because they change things. They push the human race forward. And while some may see them as the crazy ones, we see genius.", source: "Apple - Think Different", length: "long" },
  { text: "I am Groot. We are Groot. I've lived most of my life surrounded by my enemies. I would be grateful to die surrounded by my friends. I look around at us, and you know what I see? Losers. I mean like, folks who have lost stuff. And we have, man, we have, all of it. But life's giving us a chance. To do what? Something good. Something bad. A bit of both. We are the Guardians of the Galaxy.", source: "Guardians of the Galaxy", length: "long" },
  { text: "Software is a great combination between artistry and engineering. When you finally get that one thing right, it makes you feel like a god on earth. Programming isn't about typing, it's about thinking. The most disastrous thing that you can ever learn is your first programming language. Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. Code is like humor. When you have to explain it, it's bad. The best code is no code at all. Every new line of code you willingly bring into the world is code that has to be debugged.", source: "Various Tech Leaders", length: "long" },
  { text: "You want to know how I got these scars? My father was a drinker, and a fiend. Some men just want to watch the world burn. Madness, as you know, is like gravity. All it takes is a little push. Why so serious? I believe whatever doesn't kill you, simply makes you stranger. This city deserves a better class of criminal, and I'm going to give it to them. Introduce a little anarchy. Upset the established order, and everything becomes chaos.", source: "The Joker / Dark Knight", length: "long" },
  { text: "I've been looking out of a window for eighteen years, dreaming about what I might feel like when I finally step outside. When I do, I want to feel something - not scared. I think everybody has that one person in their life that's their hero. That one person who taught them to be brave, who always believed in them when no one else did. For me, that person was my mother. She once told me that the purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.", source: "Tangled & Eleanor Roosevelt", length: "long" },
  { text: "The most important thing in communication is hearing what isn't said. The art of communication is the language of leadership. We have two ears and one mouth, so that we can listen twice as much as we speak. The single biggest problem in communication is the illusion that it has taken place. Kind words can be short and easy to speak, but their echoes are truly endless. If you just communicate, you can get by. But if you communicate skillfully, you can work miracles.", source: "Various Authors", length: "long" },
];



// ─── Generation Options ──────────────────────────────────────────

export type GenerationOptions = {
  mode: 'time' | 'words' | 'quote' | 'zen' | 'custom';
  language?: 'english' | 'hindi';
  punctuation?: boolean;
  numbers?: boolean;
  wordCount?: number;
  quoteLength?: 'short' | 'medium' | 'long' | 'all';
  customText?: string;
  delimiter?: string;
  shuffle?: boolean;
};

// ─── Text Generation (client-side fallback) ──────────────────────

// Punctuation engine - forms proper sentences like MonkeyType
function applyPunctuationLocal(words: string[]): string[] {
  const result: string[] = [];
  let sentenceLength = 0;
  const targetLen = () => Math.floor(Math.random() * 8) + 3;
  let currentTarget = targetLen();
  let isNewSentence = true;

  const contractions = [
    "it's", "I'm", "don't", "can't", "won't", "I'd", "he'd", "she'd",
    "they're", "we're", "you're", "isn't", "aren't", "wasn't", "weren't",
    "I've", "you've", "we've", "they've", "I'll", "you'll", "he'll",
    "she'll", "we'll", "they'll", "didn't", "hasn't", "haven't",
    "let's", "that's", "what's", "who's", "there's", "here's"
  ];

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    if (isNewSentence) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
      isNewSentence = false;
    }

    sentenceLength++;

    if (sentenceLength >= currentTarget && i < words.length - 1) {
      const endPunct = Math.random();
      if (endPunct < 0.75) word += '.';
      else if (endPunct < 0.90) word += '?';
      else word += '!';
      isNewSentence = true;
      sentenceLength = 0;
      currentTarget = targetLen();
      result.push(word);
      continue;
    }

    const mid = Math.random();
    if (mid < 0.08 && sentenceLength > 1) word += ',';
    else if (mid < 0.11) word += ';';
    else if (mid < 0.14) word = `(${word})`;
    else if (mid < 0.16) word = `"${word}"`;
    else if (mid < 0.20) word = contractions[Math.floor(Math.random() * contractions.length)];
    else if (mid < 0.22) word += ' -';

    result.push(word);
  }

  if (result.length > 0) {
    let last = result[result.length - 1];
    const lc = last[last.length - 1];
    if (lc !== '.' && lc !== '?' && lc !== '!') last += '.';
    result[result.length - 1] = last;
  }

  return result;
}

function applyNumbersLocal(words: string[]): string[] {
  return words.map(w => {
    const r = Math.random();
    if (r < 0.06) {
      const digits = Math.floor(Math.random() * 3) + 1;
      return Math.floor(Math.random() * Math.pow(10, digits)).toString();
    }
    if (r < 0.10) {
      const nums = ['42', '100', '365', '1000', '99', '7', '13', '256', '512', '1024', '404', '500', '50', '75', '180', '360'];
      return nums[Math.floor(Math.random() * nums.length)];
    }
    return w;
  });
}

export function generateText(options: GenerationOptions): string[] {
  if (options.mode === 'custom' && options.customText) {
    let parts = options.customText.split(options.delimiter === 'pipe' ? '|' : ' ').filter(Boolean);
    if (options.shuffle) parts = parts.sort(() => Math.random() - 0.5);
    if (options.wordCount && parts.length > options.wordCount) parts = parts.slice(0, options.wordCount);
    return parts;
  }

  if (options.mode === 'quote') {
    const lengthFilter = options.quoteLength || 'all';
    const filtered = lengthFilter === 'all' ? quotes : quotes.filter(q => q.length === lengthFilter);
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    return q.text.split(' ');
  }

  let dict = options.language === 'hindi' ? hindiWords : commonWords;
  let count = options.mode === 'words' && options.wordCount ? options.wordCount : 100;
  if (options.mode === 'zen') count = 60;

  let generated: string[] = [];
  for (let i = 0; i < count; i++) {
    generated.push(dict[Math.floor(Math.random() * dict.length)]);
  }

  if (options.punctuation && options.mode !== 'zen') generated = applyPunctuationLocal(generated);
  if (options.numbers) generated = applyNumbersLocal(generated);
  
  return generated;
}

