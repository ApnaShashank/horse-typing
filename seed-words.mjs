import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const wordPools = [
  {
    name: "Top 200 Common",
    category: "common",
    words: ["the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line", "city", "put", "close", "case", "force", "meet", "once", "water", "upon", "war", "build", "hear", "light", "unite", "live", "every", "country", "bring", "center", "let", "side", "try", "provide", "continue", "name", "certain", "power", "pay", "result", "question", "study", "woman", "member", "until", "far", "night", "always", "service", "away", "report"]
  },
  {
    name: "Modern JavaScript",
    category: "programming",
    words: ["async", "await", "promise", "callback", "closure", "prototype", "constructor", "destructuring", "mutation", "immutable", "generator", "yield", "spread", "rest", "template", "literal", "arrow", "function", "module", "export", "import", "dynamic", "static", "private", "public", "protected", "extends", "super", "instance", "class", "interface", "abstract", "generic", "typeof", "instanceof", "undefined", "null", "boolean", "string", "number", "bigint", "symbol", "object", "array", "map", "set", "weakmap", "weakset", "fetch", "response", "request", "header", "method", "status", "params", "query", "payload", "token", "auth", "context", "reducer", "effect", "memo", "state", "props", "hook", "render", "mount", "unmount", "update", "batch", "schedule", "fiber", "reconciler", "portal", "fragment", "suspense", "lazy", "strict", "error", "boundary", "catch", "throw", "finally", "debugger"]
  },
  {
    name: "Complex Vocabulary",
    category: "advanced",
    words: ["idiosyncratic", "ephemeral", "quintessential", "pervasive", "meticulous", "ubiquitous", "pragmatic", "paradigm", "anomalous", "superfluous", "ostentatious", "resilient", "precarious", "clandestine", "cacophony", "benevolent", "audacious", "ambiguous", "arbitrary", "cogent", "concise", "didactic", "eclectic", "eloquent", "enigma", "equivocal", "esoteric", "facetious", "fastidious", "gratuitous", "haughty", "impetuous", "indifferent", "inevitable", "infamous", "inherent", "insipid", "intrepid", "laconic", "loquacious", "lucrative", "magnanimous", "malevolent", "nebulous", "nostalgia", "obdurate", "obsequious", "ominous", "opaque", "ostensible", "pensive", "placate", "placid", "plethora", "precipice", "proclivity", "profound", "prolific", "propensity", "recalcitrant", "redundant", "reticent", "salient", "sanguine", "scrupulous", "skeptical", "sporadic", "stagnant", "stoic", "sublime", "surreptitious", "tenacious", "terse", "transient", "trepidation", "venerable", "veracity", "verbose", "vex", "viable", "vigilant", "volatile", "voracious", "wary", "zealous"]
  },
  {
    name: "Space Exploration",
    category: "science",
    words: ["astronaut", "cosmonaut", "satellite", "orbit", "gravity", "nebula", "galaxy", "supernova", "asteroid", "comet", "meteor", "planet", "eclipse", "telescope", "rocket", "shuttle", "capsule", "lander", "rover", "mission", "trajectory", "velocity", "propulsion", "atmosphere", "stratosphere", "mesosphere", "exosphere", "vacuum", "radiation", "magnetic", "stellar", "lunar", "solar", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "exoplanet", "constellation", "observatory", "lightyear", "parallax", "zenith", "nadir", "apogee", "perigee", "payload", "telemetry", "alignment", "synchronous", "interstellar", "multiverse", "wormhole", "singularity", "horizon", "spacetime", "continuum", "extraction", "colony", "settlement", "habitation", "biostasis", "centrifuge", "escape", "horizon"]
  },
  {
    name: "Corporate Lingo",
    category: "business",
    words: ["synergy", "paradigm", "bandwidth", "leveraging", "deliverables", "stakeholders", "alignment", "scalability", "monetization", "verticals", "holistic", "empowerment", "sustainability", "pipeline", "transparency", "optimization", "collaboration", "integration", "redundancy", "compliance", "governance", "procurement", "outsource", "insource", "offshore", "headcount", "revenue", "margin", "forecast", "projection", "analysis", "metrics", "kpi", "milestone", "roadmap", "strategy", "tactical", "agile", "scrum", "kanban", "sprint", "velocity", "backlog", "stakeholder", "engagement", "retention", "acquisition", "onboarding", "lifecycle", "iteration", "evolution", "disruption", "innovation", "creativity", "leadership", "mentorship", "coaching", "training", "development", "efficiency", "productivity", "results", "objective", "key", "result"]
  },
  {
    name: "Philosophy & Logic",
    category: "philosophy",
    words: ["existentialism", "nihilism", "stoicism", "metaphysics", "epistemology", "ontology", "ethics", "aesthetics", "rationalism", "empiricism", "phenomenology", "dialectic", "dualism", "idealism", "materialism", "pragmatism", "utilitarianism", "determinism", "solipsism", "skepticism", "logic", "syllogism", "premise", "conclusion", "validity", "fallacy", "paradox", "axiom", "category", "concept", "definition", "essence", "existence", "identity", "justice", "knowledge", "meaning", "nature", "object", "perception", "quality", "reason", "substance", "truth", "universe", "value", "wisdom", "consciousness", "freedom", "morality", "virtue", "happiness", "suffering", "peace", "conflict", "harmony", "balance", "chaos", "order", "entity", "attribute", "relation", "necessity", "contingency"]
  },
  {
    name: "Short & Fast",
    category: "training",
    words: ["the", "and", "for", "not", "but", "had", "was", "all", "any", "how", "out", "now", "see", "two", "use", "way", "who", "can", "day", "did", "get", "has", "him", "his", "let", "man", "may", "old", "one", "our", "say", "set", "she", "too", "who", "boy", "did", "eat", "fat", "got", "had", "hot", "let", "not", "off", "old", "red", "run", "sat", "six", "ten", "the", "top", "was", "wet", "yes", "you", "bad", "big", "box", "but", "can", "cup", "dad", "dog", "fun", "get", "hen", "hop", "hot", "jam", "jet", "kit", "log", "mad", "map", "mom", "net", "not", "nut", "pen", "pet", "pig", "pot", "rat", "sun", "tag", "ten", "tub", "van", "wig", "zip"]
  },
  {
    name: "Tech Buzzwords",
    category: "tech",
    words: ["cloud", "serverless", "microservices", "containers", "docker", "kubernetes", "blockchain", "ethereum", "bitcoin", "mining", "ledger", "smart", "contract", "decentralized", "neural", "network", "machine", "learning", "deep", "intelligence", "algorithm", "big", "data", "analytics", "visualization", "dashboard", "api", "endpoint", "restful", "graphql", "websocket", "latency", "throughput", "bandwidth", "storage", "database", "sql", "nosql", "cache", "redis", "security", "encryption", "cryptography", "firewall", "firewall", "router", "gateway", "proxy", "virtualization", "hypervisor", "sandbox", "containerization", "deployment", "pipeline", "cicd", "automation", "orchestration", "infrastructure", "terraform", "ansible", "cloudformation", "server", "compute", "instance", "node", "cluster"]
  },
  {
    name: "Medical & Biology",
    category: "science",
    words: ["anatomy", "physiology", "genetics", "molecule", "protein", "enzyme", "hormone", "cell", "tissue", "organ", "system", "bacteria", "virus", "infection", "immune", "antibody", "antigen", "plasma", "platelet", "artery", "vein", "capillary", "heart", "lungs", "brain", "liver", "kidney", "stomach", "intestine", "muscle", "bone", "nerve", "synapse", "neurotransmitter", "receptor", "dna", "rna", "chromosome", "mutation", "evolution", "metabolism", "digestion", "respiration", "circulation", "excretion", "reproduction", "embryo", "fetus", "growth", "development", "disease", "disorder", "symptom", "diagnosis", "prognosis", "therapy", "treatment", "medicine", "pharmacy", "vaccine", "antibiotic", "surgery", "trauma", "health", "wellness", "nutrition", "vitamin", "mineral", "obesity", "diabetes", "cancer", "allergy"]
  },
  {
    name: "Top 500 Ngrams",
    category: "training",
    words: ["ing", "ion", "tio", "ent", "ati", "ter", "ate", "est", "the", "and", "tha", "her", "eth", "ist", "for", "res", "ver", "all", "wit", "ons", "rea", "con", "int", "str", "ect", "ted", "nce", "ive", "ity", "ous", "abl", "ful", "less", "ment", "ness", "ship", "ward", "wise", "able", "ible", "ance", "ence", "ical", "ious", "ally", "ever", "over", "some", "time", "under", "where", "which", "would", "could", "should", "people", "around", "against", "before", "between", "through", "without", "another", "because", "program", "problem", "however", "provide", "continue", "example", "quality", "service", "working", "finding", "against", "program", "system", "however", "between", "another", "present", "without", "program", "problem", "however", "general", "against"]
  }
];

async function main() {
  console.log('Seeding word pools...');
  for (const poolData of wordPools) {
    await prisma.wordPool.upsert({
      where: { name: poolData.name },
      update: poolData,
      create: poolData,
    });
    console.log(`- Seeded: ${poolData.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
