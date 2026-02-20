// Top 200 common English words for standard typing tests
export const commonWords = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", 
  "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", 
  "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", 
  "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", 
  "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", 
  "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", 
  "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", 
  "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", 
  "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", 
  "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", 
  "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "system", "water", 
  "program", "always", "word", "every", "local", "run", "number", "play", "fact", "keep", "group", "stand", "early", "set", "study"
];

// Helper to get random item from array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random string of numbers and symbols
export const getNumbers = (count: number) => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate numbers like 123, 49, 1024, sometimes with punctuation
    let num = Math.floor(Math.random() * 10000).toString();
    if (Math.random() > 0.8) num += randomItem([',', '.', '!', '?']);
    result.push(num);
  }
  return result.join(" ");
};

// Generate mixed quotes/programming specific strings
export const getSymbols = (count: number) => {
  const symbols = ["()", "{}", "[]", "=>", "==", "!=", "&&", "||", "+=", "-=", "/*", "*/", "...", "->"];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.5) {
      result.push(randomItem(symbols));
    } else {
      result.push(randomItem(commonWords) + randomItem(symbols)[0]);
    }
  }
  return result.join(" ");
};

export const getWords = (count: number, mode: 'words' | 'numbers' | 'symbols' = 'words'): string => {
  if (mode === 'numbers') return getNumbers(count);
  if (mode === 'symbols') return getSymbols(count);
  
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(randomItem(commonWords));
  }
  return result.join(" ");
};
