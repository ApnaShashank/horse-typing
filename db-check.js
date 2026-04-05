const { MongoClient } = require('mongodb');

const words = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "been", "has", "had", "doing", "did", "does",
  "computer", "system", "program", "code", "software", "network", "server", "database",
  "application", "interface", "developer", "browser", "internet", "website", "project",
  "design", "build", "create", "function", "variable", "string", "number", "object",
  "array", "boolean", "loop", "condition", "statement", "class", "method", "property",
  "event", "listener", "callback", "promise", "async", "await", "import", "export"
]; // ~ 100+ standard words

const quotes = [
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", length: 11 },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", length: 17 },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison", length: 12 },
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin", length: 17 },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", length: 14 },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", length: 11 },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston S. Churchill", length: 16 }
];

async function main() {
  const uri = "mongodb+srv://shashank8808108802_db_user:7Knnpd9YgBatrzGS@sankymovie.imrf7ms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to server");
    
    const db = client.db('horse_typing');
    
    // Seed words
    const wordsCollection = db.collection('words');
    await wordsCollection.deleteMany({}); // clear existing
    await wordsCollection.insertMany(words.map(w => ({ word: w })));
    console.log("Seeded " + words.length + " words");

    // Seed quotes
    const quotesCollection = db.collection('quotes');
    await quotesCollection.deleteMany({});
    await quotesCollection.insertMany(quotes);
    console.log("Seeded " + quotes.length + " quotes");

  } finally {
    await client.close();
  }
}

main().catch(console.error);
