export const STRING_JSON_CORE_TERMS = [
  'string to json',
  'json to string',
  'json string to object',
  'parse json string',
] as const;

const LONG_TAIL_MODIFIERS = [
  'online free',
  'with examples',
  'for api response',
  'without eval',
  'with escape characters',
  'for nested objects',
  'for arrays',
  'in browser',
  'for beginners',
  'for interview questions',
  'with pretty output',
  'for minified payload',
  'for webhook debugging',
  'for postman response',
  'for local file',
  'for large payload',
  'with validation',
  'with error line number',
  'secure way',
  'best method',
  'regex vs parser',
  'edge cases',
  'in frontend app',
  'in backend service',
  'without losing data types',
] as const;

export const STRING_JSON_LONG_TAIL_KEYWORDS = STRING_JSON_CORE_TERMS.flatMap((base) =>
  LONG_TAIL_MODIFIERS.map((modifier) => `${base} ${modifier}`)
);

const LANGUAGE_SET = [
  'javascript',
  'typescript',
  'python',
  'csharp',
  'java',
  'golang',
  'php',
  'ruby',
  'swift',
  'kotlin',
] as const;

const LANGUAGE_PATTERNS = [
  'string to json',
  'json to string',
  'parse json string to object',
  'serialize object to json string',
  'json parse error handling',
] as const;

export const STRING_JSON_LANGUAGE_KEYWORDS = LANGUAGE_SET.flatMap((language) =>
  LANGUAGE_PATTERNS.map((pattern) => `${language} ${pattern}`)
);

export const STRING_JSON_ERROR_KEYWORDS = [
  'unexpected token in json at position 0',
  'unexpected token o in json at position 1',
  'json parse error unexpected end of input',
  'unterminated string in json parse',
  'bad control character in json string',
  'json parse error trailing comma',
  'json parse error single quotes',
  'json parse error invalid unicode escape',
  'json parse error invalid number',
  'json parse error unexpected character',
  'json parse error after array element',
  'json parse error after object key',
  'json parse error missing colon',
  'json parse error expecting property name',
  'json parse error invalid escape sequence',
  'json parse error line 1 column 1',
  'json parse error at line and column',
  'cannot parse json string to object',
  'failed to parse json string',
  'json syntax error while parsing value',
  'json parse error from api response',
  'json parse error html instead of json',
  'json parse error null byte',
  'json parse error bom character',
  'json parse error with backslash',
  'json parse error with newline in string',
  'json stringify circular structure error',
  'json parse error in local storage data',
  'json parse error handling best practice',
  'recover from invalid json string',
] as const;

export const STRING_JSON_PERFORMANCE_KEYWORDS = [
  'parse large json string efficiently',
  'json parse performance benchmark',
  'fastest way to parse json string',
  'stream parse json string',
  'memory efficient json parsing',
  'json stringify performance optimization',
  'handle 100mb json string parsing',
  'parse huge json without blocking ui',
  'json parse in web worker',
  'incremental json parsing strategy',
  'avoid json parse freeze in browser',
  'low memory json to string conversion',
  'json parsing throughput optimization',
  'high performance json serializer',
  'json parse vs custom parser performance',
  'parse json string in chunks',
  'fast json parser for nodejs',
  'optimize json parse in python',
  'optimize json parse in java',
  'parse million row json payload',
] as const;

export const STRING_JSON_URL_STRUCTURE = [
  { url: '/string-to-json', role: 'Pillar hybrid page', intent: 'Tool + informational' },
  { url: '/json-to-string', role: 'Supporting landing page', intent: 'Tool intent' },
  { url: '/json-string-to-object', role: 'Supporting landing page', intent: 'Debugging intent' },
  { url: '/parse-json-string', role: 'Supporting landing page', intent: 'Informational + debugging' },
  { url: '/blog/string-to-json-language-guide', role: 'Language expansion post', intent: 'Informational' },
  { url: '/blog/json-parse-errors-and-fixes', role: 'Error post cluster', intent: 'Debugging intent' },
] as const;

export const STRING_JSON_INTERNAL_LINKS = [
  {
    source: '/string-to-json',
    target: '/json-parser',
    anchor: 'parse JSON string online',
    reason: 'Strong transactional CTA from the pillar page',
  },
  {
    source: '/string-to-json',
    target: '/json-formatter',
    anchor: 'format parsed JSON',
    reason: 'Natural next step after successful parse',
  },
  {
    source: '/string-to-json',
    target: '/json-validator',
    anchor: 'validate JSON syntax',
    reason: 'Captures debugging-intent users',
  },
  {
    source: '/json-to-string',
    target: '/json-minifier',
    anchor: 'convert JSON to compact string',
    reason: 'Semantic and conversion-aligned internal link',
  },
  {
    source: '/parse-json-string',
    target: '/errors',
    anchor: 'JSON parse errors',
    reason: 'Routes users into error fix cluster',
  },
  {
    source: '/json-string-to-object',
    target: '/languages',
    anchor: 'language specific JSON parsing guides',
    reason: 'Improves cluster depth and topical authority',
  },
] as const;

export const STRING_JSON_ON_PAGE_TEMPLATE = {
  h1: 'String to JSON: Parse JSON Strings Safely and Fast',
  h2: [
    'String to JSON vs JSON to String',
    'Language-Specific Parsing Patterns',
    'Common JSON Parse Errors and Fixes',
    'Performance Tips for Large Payloads',
    'FAQ',
  ],
  faq: [
    'How do I convert string to JSON online?',
    'How do I parse JSON string to object in JavaScript?',
    'Why do I get unexpected token in JSON errors?',
    'What is the fastest way to parse large JSON strings?',
  ],
} as const;

export const STRING_JSON_SCHEMA_TYPES = [
  'WebPage',
  'FAQPage',
  'HowTo',
  'ItemList',
  'BreadcrumbList',
] as const;

export const STRING_JSON_CONTENT_DEPTH = {
  pillarWords: '1800-2600 words',
  supportWords: '900-1400 words',
  examplesPerPage: '8-15 runnable snippets',
  faqCount: '6-10 FAQs',
} as const;

function assertCount(name: string, actual: number, expected: number): void {
  if (actual !== expected) {
    throw new Error(`${name} expected ${expected} keywords, got ${actual}`);
  }
}

assertCount('Long-tail', STRING_JSON_LONG_TAIL_KEYWORDS.length, 100);
assertCount('Language-specific', STRING_JSON_LANGUAGE_KEYWORDS.length, 50);
assertCount('Error-based', STRING_JSON_ERROR_KEYWORDS.length, 30);
assertCount('Performance', STRING_JSON_PERFORMANCE_KEYWORDS.length, 20);
