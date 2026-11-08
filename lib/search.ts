// Site search for the header. Finds pages, services, cities, and FAQ questions
// as you type. Handles plurals and small typos, and ranks title matches first.

export type SearchEntry = {
  type: 'service' | 'location' | 'faq' | 'page';
  title: string;
  href: string;
  // Searched, but not shown.
  description: string;
  // The line shown under the title. Falls back to the description.
  short?: string;
  // Other words people might type when looking for this.
  keywords: readonly string[];
  // Leaves the site, like the quote form.
  external?: boolean;
  // A small nudge up the list.
  boost?: number;
};

export type SearchGroup = {
  label: string;
  entries: SearchEntry[];
};

// Short words that don't help find anything.
const skipWords = new Set(['a', 'an', 'the', 'and', 'of', 'for', 'in', 'to', 'my', 'i', 'me', 'do', 'you', 'is']);

const groupLabels: Record<SearchEntry['type'], string> = {
  service: 'Services',
  location: 'Locations',
  faq: 'Questions',
  page: 'Pages',
};

// The most results each heading shows.
const groupSizes: Record<SearchEntry['type'], number> = {
  service: 6,
  location: 6,
  faq: 3,
  page: 4,
};

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim();
}

// Treat plurals as the same word: windows → window, but leave words like glass alone.
function stem(word: string) {
  return word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word;
}

function words(text: string) {
  return normalize(text).split(' ').filter(Boolean).map(stem);
}

// The words someone typed, without the ones that don't help.
function queryWords(query: string) {
  return words(query).filter((word) => !skipWords.has(word));
}

// Allow one typo in words of 4+ letters and two in words of 8+. Swapped letters count as one.
function closeEnough(a: string, b: string) {
  const max = a.length >= 8 ? 2 : a.length >= 4 ? 1 : 0;
  if (max === 0 || Math.abs(a.length - b.length) > max) return false;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length] <= max;
}

// How well one typed word matches a list of words. Typos only count when allowed,
// so long descriptions don't pull in look-alike words.
function matchWord(token: string, list: readonly string[], allowTypos: boolean) {
  let best = 0;
  for (const word of list) {
    if (word === token) return 1;
    if (word.startsWith(token)) {
      best = Math.max(best, token.length >= 2 ? 0.85 : 0.4);
    } else if (
      allowTypos &&
      (closeEnough(token, word) ||
        (word.length > token.length + 1 && closeEnough(token, word.slice(0, token.length))))
    ) {
      best = Math.max(best, 0.6);
    }
  }
  return best;
}

// Prepares the entries once and returns a search function for them.
export function createSearch(entries: readonly SearchEntry[]) {
  const prepared = entries.map((entry) => ({
    entry,
    title: normalize(entry.title),
    titleWords: words(entry.title),
    keywordWords: words(entry.keywords.join(' ')),
    textWords: words(entry.description),
  }));
  // Words that appear in a title or keyword. A typed word found here is not a typo.
  const knownWords = prepared.flatMap((item) => [...item.titleWords, ...item.keywordWords]);

  // Every typed word has to match somewhere. Title matches count most, then keywords,
  // then the description. Results far weaker than the best one are dropped.
  return function search(query: string): SearchEntry[] {
    const tokens = queryWords(query);
    if (tokens.length === 0) return [];
    const typoTokens = new Set(tokens.filter((token) => !knownWords.some((word) => word.startsWith(token))));
    const results: { entry: SearchEntry; score: number; matched: number }[] = [];
    for (const item of prepared) {
      let score = 0;
      let matched = 0;
      for (const token of tokens) {
        const allowTypos = typoTokens.has(token);
        const points = Math.max(
          matchWord(token, item.titleWords, allowTypos) * 3,
          matchWord(token, item.keywordWords, allowTypos) * 2,
          matchWord(token, item.textWords, false),
        );
        if (points > 0) matched += 1;
        score += points;
      }
      if (matched === 0) continue;
      if (item.title.startsWith(normalize(query))) score += 2;
      results.push({ entry: item.entry, score: score + (item.entry.boost ?? 0), matched });
    }
    // Prefer results that match every word. If none do, show the closest partial matches.
    const full = results.filter((result) => result.matched === tokens.length);
    const pool = full.length > 0 ? full : results.filter((result) => result.matched >= Math.ceil(tokens.length / 2));
    if (pool.length === 0) return [];
    pool.sort((first, second) => second.score - first.score);
    const cutoff = pool[0].score * 0.45;
    return pool.filter((result) => result.score >= cutoff).map((result) => result.entry);
  };
}

// Puts results under headings. Headings follow the order of their best result,
// so the first option is always the closest match.
export function groupResults(results: readonly SearchEntry[]): SearchGroup[] {
  const groups = new Map<SearchEntry['type'], SearchEntry[]>();
  for (const entry of results) {
    const list = groups.get(entry.type) ?? [];
    if (list.length < groupSizes[entry.type]) list.push(entry);
    groups.set(entry.type, list);
  }
  return [...groups].map(([type, list]) => ({ label: groupLabels[type], entries: list }));
}

// Splits a title into parts, marking the start of each word that matches what was typed.
export function highlight(title: string, query: string) {
  const tokens = queryWords(query);
  const parts: { text: string; marked: boolean }[] = [];
  for (const part of title.split(/(\s+)/)) {
    const plain = normalize(part);
    const token = plain ? tokens.find((word) => plain.startsWith(word)) : undefined;
    if (!token) {
      parts.push({ text: part, marked: false });
      continue;
    }
    // Skip punctuation at the start of a word, like the "(" in "(AZ)".
    const lead = part.length - part.replace(/^[^A-Za-z0-9%]+/, '').length;
    const end = lead + token.length;
    parts.push(
      { text: part.slice(0, lead), marked: false },
      { text: part.slice(lead, end), marked: true },
      { text: part.slice(end), marked: false },
    );
  }
  return parts.filter((part) => part.text);
}
