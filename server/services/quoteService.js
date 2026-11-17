import axios from 'axios';
import Quote from '../models/Quote.js';

const TIMEOUT = parseInt(process.env.API_TIMEOUT_MS || '6000', 10);

/**
 * Curated high-quality backup quotes used only if all external services fail or are unreachable.
 */
const EMERGENCY_FALLBACK_QUOTES = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration",
    tags: ["work", "passion", "success"],
    source: "curated_fallback",
  },
  {
    content: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Wisdom",
    tags: ["adversity", "opportunity", "mindset"],
    source: "curated_fallback",
  },
  {
    content: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "Motivation",
    tags: ["action", "purpose", "impact"],
    source: "curated_fallback",
  },
  {
    content: "Happiness depends upon ourselves.",
    author: "Aristotle",
    category: "Philosophy",
    tags: ["happiness", "philosophy", "life"],
    source: "curated_fallback",
  },
  {
    content: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "Action",
    tags: ["courage", "determination"],
    source: "curated_fallback",
  },
];

/**
 * Infer category and tags based on text when external provider does not supply them.
 */
function inferCategoryAndTags(text, explicitCategory) {
  if (explicitCategory && explicitCategory.toLowerCase() !== 'all' && explicitCategory.toLowerCase() !== 'any') {
    return {
      category: explicitCategory.charAt(0).toUpperCase() + explicitCategory.slice(1),
      tags: [explicitCategory.toLowerCase()],
    };
  }

  const lower = text.toLowerCase();
  if (/success|achieve|win|goal|dream|work|passion|hustle/i.test(lower)) {
    return { category: 'Success', tags: ['success', 'achievement', 'motivation'] };
  }
  if (/wisdom|truth|mind|thought|think|knowledge|learn|understand/i.test(lower)) {
    return { category: 'Wisdom', tags: ['wisdom', 'knowledge', 'mindset'] };
  }
  if (/happy|joy|love|peace|smile|heart|grateful|gratitude/i.test(lower)) {
    return { category: 'Happiness', tags: ['happiness', 'joy', 'life'] };
  }
  if (/life|live|world|human|time|moment|journey/i.test(lower)) {
    return { category: 'Life', tags: ['life', 'perspective', 'journey'] };
  }
  if (/fear|courage|brave|strength|strong|fight|adversity/i.test(lower)) {
    return { category: 'Courage', tags: ['courage', 'strength', 'resilience'] };
  }
  return { category: 'Inspiration', tags: ['inspiration', 'quotes', 'daily'] };
}

/**
 * Fetch from Quotable API (Primary Provider)
 */
async function fetchFromQuotable(category) {
  const url = 'https://api.quotable.io/random';
  const params = {};
  if (category && category.toLowerCase() !== 'all' && category.toLowerCase() !== 'any') {
    params.tags = category.toLowerCase();
  }

  const response = await axios.get(url, {
    params,
    timeout: TIMEOUT,
    headers: { Accept: 'application/json' },
  });

  const data = response.data;
  if (!data || !data.content) {
    throw new Error('Invalid response structure from Quotable API');
  }

  const tags = Array.isArray(data.tags) ? data.tags : [];
  const primaryTag = tags[0] ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1) : 'Inspiration';

  return {
    content: data.content.trim(),
    author: (data.author || 'Unknown').trim(),
    category: primaryTag,
    tags: tags.length ? tags : ['inspiration'],
    source: 'quotable',
    externalQuoteId: data._id || null,
  };
}

/**
 * Fetch from DummyJSON Quotes API (Fallback Provider 1)
 */
async function fetchFromDummyJSON(category) {
  // DummyJSON quotes have 1450+ quotes
  // We can fetch random quote or pick a random id between 1 and 1450
  const randomId = Math.floor(Math.random() * 1400) + 1;
  const url = `https://dummyjson.com/quotes/${randomId}`;

  const response = await axios.get(url, {
    timeout: TIMEOUT,
    headers: { Accept: 'application/json' },
  });

  const data = response.data;
  if (!data || !data.quote) {
    throw new Error('Invalid response structure from DummyJSON API');
  }

  const inferred = inferCategoryAndTags(data.quote, category);

  return {
    content: data.quote.trim(),
    author: (data.author || 'Unknown').trim(),
    category: inferred.category,
    tags: inferred.tags,
    source: 'dummyjson',
    externalQuoteId: String(data.id || randomId),
  };
}

/**
 * Fetch from ZenQuotes API (Fallback Provider 2)
 */
async function fetchFromZenQuotes(category) {
  const url = 'https://zenquotes.io/api/random';

  const response = await axios.get(url, {
    timeout: TIMEOUT,
    headers: { Accept: 'application/json' },
  });

  const data = response.data;
  if (!Array.isArray(data) || !data[0] || !data[0].q) {
    throw new Error('Invalid response structure from ZenQuotes API');
  }

  const item = data[0];
  const inferred = inferCategoryAndTags(item.q, category);

  return {
    content: item.q.trim(),
    author: (item.a || 'Unknown').trim(),
    category: inferred.category,
    tags: inferred.tags,
    source: 'zenquotes',
    externalQuoteId: null,
  };
}

/**
 * Master quote fetcher with cascading fallback and error isolation
 */
export async function fetchExternalQuote(requestedCategory = null) {
  const providers = [
    { name: 'Quotable', fn: () => fetchFromQuotable(requestedCategory) },
    { name: 'DummyJSON', fn: () => fetchFromDummyJSON(requestedCategory) },
    { name: 'ZenQuotes', fn: () => fetchFromZenQuotes(requestedCategory) },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      const quote = await provider.fn();
      if (quote && quote.content && quote.content.length > 5) {
        return quote;
      }
    } catch (err) {
      errors.push(`${provider.name}: ${err.message}`);
    }
  }

  console.warn('⚠️ All external quote APIs failed. Using curated inspiration repository. Errors:', errors);

  // Return curated fallback quote as last resort
  const fallback = EMERGENCY_FALLBACK_QUOTES[Math.floor(Math.random() * EMERGENCY_FALLBACK_QUOTES.length)];
  return {
    ...fallback,
    externalQuoteId: 'fallback-' + Date.now(),
  };
}

/**
 * Fetches Quote of the Day (deterministic or from ZenQuotes today endpoint)
 */
export async function fetchQuoteOfTheDay() {
  try {
    const response = await axios.get('https://zenquotes.io/api/today', {
      timeout: TIMEOUT,
      headers: { Accept: 'application/json' },
    });
    if (Array.isArray(response.data) && response.data[0] && response.data[0].q) {
      const item = response.data[0];
      const inferred = inferCategoryAndTags(item.q, 'Daily Wisdom');
      return {
        content: item.q.trim(),
        author: (item.a || 'Unknown').trim(),
        category: 'Quote of the Day',
        tags: ['daily', 'wisdom', ...inferred.tags],
        source: 'zenquotes-today',
        externalQuoteId: 'daily-' + new Date().toISOString().slice(0, 10),
      };
    }
  } catch (err) {
    // Fall back to generating a quote
  }
  return fetchExternalQuote('Inspiration');
}

/**
 * Generates and automatically stores quote in MongoDB with duplicate detection
 */
export async function generateAndSaveQuote(category = null) {
  const rawQuote = await fetchExternalQuote(category);

  const contentHash = Quote.generateHash(rawQuote.content, rawQuote.author);
  const windowSeconds = parseInt(process.env.DUPLICATE_WINDOW_SECONDS || '86400', 10);

  if (windowSeconds > 0) {
    const windowStart = new Date(Date.now() - windowSeconds * 1000);
    const existingRecent = await Quote.findOne({
      contentHash,
      createdAt: { $gte: windowStart },
    });

    if (existingRecent) {
      // If duplicate was recently saved, we can return it with duplicate flag
      return {
        quote: existingRecent,
        isDuplicate: true,
        savedNew: false,
      };
    }
  }

  // Create new Quote in MongoDB
  const newQuote = new Quote({
    content: rawQuote.content,
    author: rawQuote.author || 'Unknown',
    category: rawQuote.category || 'General',
    tags: rawQuote.tags || [],
    source: rawQuote.source || 'external-api',
    externalQuoteId: rawQuote.externalQuoteId || null,
    contentHash,
    isFavourite: false,
  });

  const savedQuote = await newQuote.save();

  return {
    quote: savedQuote,
    isDuplicate: false,
    savedNew: true,
  };
}
