/**
 * Per-tool placeholder text for the input editor when empty.
 * Shown as overlay (not real content); disappears on focus or when user types.
 * Encourages using the Sample button to see expected format.
 */

const DEFAULT_PLACEHOLDER =
  'Paste your input here. Use the **Sample** button above to see the expected format for this tool.';

/** Tools that work with empty input — we can show output-only layout (no left editor). */
export const INPUT_OPTIONAL_TOOL_IDS = new Set([
  'lorem-ipsum',
  'uuid-generator',
  'random-json-generator',
  'timestamp-converter',
]);

export function isInputOptionalTool(toolId: string): boolean {
  return INPUT_OPTIONAL_TOOL_IDS.has(toolId);
}

const PLACEHOLDERS: Record<string, string> = {
  'lorem-ipsum':
    'Optional: leave empty for 3 paragraphs, or enter a number (1–20). Use **Sample** to see an example.',
  'uuid-generator':
    'Optional: leave empty for 1 UUID, or enter a number (1–50). Use **Sample** to see format.',
  'random-json-generator':
    'Optional: leave empty for 5 keys, or enter a number (1–20). Use **Sample** to see format.',
  'timestamp-converter':
    'Optional: leave empty for current time, or enter a Unix timestamp or date string. Use **Sample** to see format.',
  'regex-tester':
    'Line 1: regex pattern (e.g. /\\d+/g). Next lines: text to test. Use **Sample** to see format.',
  'jwt-generator':
    'Paste a JSON payload (e.g. {"sub":"user123","exp":...}). Use **Sample** to see format.',
  'hash-generator':
    'Enter text to hash (MD5 + SHA-256). Use **Sample** to see format.',
  'color-converter':
    'Enter a color: #RRGGBB, rgb(r,g,b), or hsl(h,s%,l%). Use **Sample** to see format.',
  'text-case-converter':
    'Enter text to convert to different cases. Use **Sample** to see format.',
  'json-formatter':
    'Paste minified or raw JSON. Use **Sample** to see example input.',
  'json-validator':
    'Paste JSON to validate. Use **Sample** to see example.',
  'json-minifier':
    'Paste JSON to minify. Use **Sample** to see example.',
  'json-to-xml':
    'Paste JSON to convert to XML. Use **Sample** to see example.',
  'json-to-csv':
    'Paste a JSON array of objects. Use **Sample** to see example.',
  'json-to-yaml':
    'Paste JSON to convert to YAML. Use **Sample** to see example.',
  'csv-to-json':
    'Paste CSV text. Use **Sample** to see example.',
  'yaml-formatter':
    'Paste YAML. Use **Sample** to see example.',
  'yaml-to-json':
    'Paste YAML to convert to JSON. Use **Sample** to see example.',
  'xml-formatter':
    'Paste XML. Use **Sample** to see example.',
  'xml-validator':
    'Paste XML to validate. Use **Sample** to see example.',
  'xml-to-json':
    'Paste XML to convert to JSON. Use **Sample** to see example.',
  'html-formatter':
    'Paste HTML. Use **Sample** to see example.',
  'url-encode':
    'Enter text to URL-encode. Use **Sample** to see example.',
  'url-decode':
    'Paste URL-encoded text to decode. Use **Sample** to see example.',
  'base64-encode':
    'Enter text to encode as Base64. Use **Sample** to see example.',
  'base64-decode':
    'Paste Base64 string to decode. Use **Sample** to see example.',
  'base64':
    'Enter text to encode, or Base64 to decode (toggle mode in toolbar). Use **Sample** to see example.',
  'jwt-decoder':
    'Paste a JWT to decode. Use **Sample** to see example.',
  'json-diff':
    'Use left and right panels for the two JSON documents to compare.',
  'json-compare':
    'Use left and right panels for the two JSON documents to compare.',
};

export function getInputPlaceholder(toolId: string): string {
  return PLACEHOLDERS[toolId] ?? DEFAULT_PLACEHOLDER;
}

/** Placeholder for output panel when empty (no result yet). */
export function getOutputPlaceholder(toolId: string): string {
  if (isInputOptionalTool(toolId)) {
    return 'Click **Run** to generate (uses default if input is empty). Use **Sample** then Run to see an example.';
  }
  return 'Output will appear here after you run. Use the **Sample** button to load example input, then **Run**.';
}
