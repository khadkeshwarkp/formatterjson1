import yaml from 'js-yaml';
import * as jsonToCode from './json-to-code';

export interface ProcessResult {
  output: string;
  error: string | null;
  /** 1-indexed line number of the error, if available */
  errorLine: number | null;
}

// ─── JSON Diff ───────────────────────────────────────────────────
const DIFF_DELIMITER = '\n---\n';

/** Single-input version (delimiter-separated); kept for backward compatibility. */
export function jsonDiff(input: string): ProcessResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '', error: null, errorLine: null };
  const parts = trimmed.split(DIFF_DELIMITER);
  if (parts.length < 2) {
    return { output: '', error: 'Use left and right panels for side-by-side comparison', errorLine: null };
  }
  return jsonDiffTwo(parts[0].trim(), parts[1].trim());
}

/** Two-input version for side-by-side JSON diff. */
export function jsonDiffTwo(leftStr: string, rightStr: string): ProcessResult {
  try {
    if (!leftStr.trim() && !rightStr.trim()) return { output: '', error: null, errorLine: null };
    if (!leftStr.trim()) return { output: '', error: 'Paste JSON in the left panel', errorLine: null };
    if (!rightStr.trim()) return { output: '', error: 'Paste JSON in the right panel', errorLine: null };
    const left = JSON.parse(leftStr);
    const right = JSON.parse(rightStr);
    const lines: string[] = [];
    const diff = compareValues(left, right, '');
    if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
      return { output: '✓ No differences — both JSON objects are identical', error: null, errorLine: null };
    }
    diff.added.forEach(({ path, value }) => lines.push(`+ ${path}: ${formatValue(value)}`));
    diff.removed.forEach(({ path, value }) => lines.push(`- ${path}: ${formatValue(value)}`));
    diff.changed.forEach(({ path, oldVal, newVal }) =>
      lines.push(`~ ${path}:\n    - ${formatValue(oldVal)}\n    + ${formatValue(newVal)}`)
    );
    return { output: lines.join('\n'), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

function formatValue(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 80) + (JSON.stringify(v).length > 80 ? '...' : '');
  return String(v);
}

interface DiffResult {
  added: { path: string; value: unknown }[];
  removed: { path: string; value: unknown }[];
  changed: { path: string; oldVal: unknown; newVal: unknown }[];
}

function compareValues(left: unknown, right: unknown, path: string): DiffResult {
  const result: DiffResult = { added: [], removed: [], changed: [] };
  if (typeof left !== 'object' || left === null || Array.isArray(left)) {
    if (typeof right !== 'object' || right === null || Array.isArray(right)) {
      if (JSON.stringify(left) !== JSON.stringify(right)) {
        result.changed.push({ path: path || 'root', oldVal: left, newVal: right });
      }
    } else {
      result.removed.push({ path: path || 'root', value: left });
      result.added.push({ path: path || 'root', value: right });
    }
    return result;
  }
  if (typeof right !== 'object' || right === null || Array.isArray(right)) {
    result.removed.push({ path: path || 'root', value: left });
    result.added.push({ path: path || 'root', value: right });
    return result;
  }
  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
  for (const key of allKeys) {
    const p = path ? `${path}.${key}` : key;
    if (!(key in leftObj)) {
      result.added.push({ path: p, value: rightObj[key] });
    } else if (!(key in rightObj)) {
      result.removed.push({ path: p, value: leftObj[key] });
    } else {
      const l = leftObj[key];
      const r = rightObj[key];
      if (JSON.stringify(l) !== JSON.stringify(r)) {
        if (typeof l === 'object' && l !== null && !Array.isArray(l) && typeof r === 'object' && r !== null && !Array.isArray(r)) {
          const nested = compareValues(l, r, p);
          result.added.push(...nested.added);
          result.removed.push(...nested.removed);
          result.changed.push(...nested.changed);
        } else {
          result.changed.push({ path: p, oldVal: l, newVal: r });
        }
      }
    }
  }
  return result;
}

// ─── JSON Formatter ──────────────────────────────────────────────
export function formatJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    return { output: JSON.stringify(obj, null, 2), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

// ─── JSON Validator ──────────────────────────────────────────────
export function validateJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    JSON.parse(input);
    return { output: '✓ Valid JSON', error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

// ─── JSON Minifier ───────────────────────────────────────────────
export function minifyJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    return { output: JSON.stringify(obj), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

// ─── JSON → XML ──────────────────────────────────────────────────
export function jsonToXml(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    const xml = toXml(obj, 'root', 0);
    return {
      output: '<?xml version="1.0" encoding="UTF-8"?>\n' + xml,
      error: null,
      errorLine: null,
    };
  } catch (e) {
    return parseJsonError(e);
  }
}

function toXml(value: unknown, tag: string, depth: number): string {
  const indent = '  '.repeat(depth);
  const inner = '  '.repeat(depth + 1);

  if (value === null || value === undefined) {
    return `${indent}<${tag} />\n`;
  }

  if (Array.isArray(value)) {
    let xml = `${indent}<${tag}>\n`;
    value.forEach((item, i) => {
      xml += toXml(item, `item_${i}`, depth + 1);
    });
    xml += `${indent}</${tag}>\n`;
    return xml;
  }

  if (typeof value === 'object') {
    let xml = `${indent}<${tag}>\n`;
    for (const [key, val] of Object.entries(value)) {
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
      xml += toXml(val, safeKey, depth + 1);
    }
    xml += `${indent}</${tag}>\n`;
    return xml;
  }

  const escaped = String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `${indent}<${tag}>${escaped}</${tag}>\n`;
}

// ─── JSON → CSV ──────────────────────────────────────────────────
export function jsonToCsv(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const data = JSON.parse(input);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return { output: '', error: null, errorLine: null };
    const headers = Array.from(new Set(arr.flatMap((row) => Object.keys(row))));
    const csvRows = [
      headers.map(escapeCsvField).join(','),
      ...arr.map((row) =>
        headers.map((h) => escapeCsvField(row[h] ?? '')).join(',')
      ),
    ];
    return { output: csvRows.join('\n'), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

function escapeCsvField(value: unknown): string {
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ─── JSON → YAML ─────────────────────────────────────────────────
export function jsonToYaml(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    return { output: toYaml(obj, 0), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

function toYaml(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return 'null\n';
  if (typeof value === 'boolean') return `${value}\n`;
  if (typeof value === 'number') return `${value}\n`;
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes(':') || value.includes('#')) {
      return `"${value.replace(/"/g, '\\"')}"\n`;
    }
    return `${value}\n`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]\n';
    return value.map((item) => {
      const inner = toYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null) {
        return `${pad}- ${inner.trimStart()}`;
      }
      return `${pad}- ${inner}`;
    }).join('');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}\n';
    return entries.map(([key, val]) => {
      const inner = toYaml(val, indent + 1);
      if (typeof val === 'object' && val !== null) {
        return `${pad}${key}:\n${inner}`;
      }
      return `${pad}${key}: ${inner}`;
    }).join('');
  }
  return `${String(value)}\n`;
}

// ─── CSV → JSON ──────────────────────────────────────────────────
export function csvToJson(input: string): ProcessResult {
  try {
    const trimmed = input.trim();
    if (!trimmed) return { output: '', error: null, errorLine: null };
    const lines = trimmed.split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length === 0) return { output: '[]', error: null, errorLine: null };
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map((line) => {
      const vals = parseCsvLine(line);
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = vals[i] ?? '';
      });
      return obj;
    });
    return { output: JSON.stringify(rows, null, 2), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let val = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          val += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++;
          break;
        } else {
          val += line[i++];
        }
      }
      result.push(val);
    } else {
      const comma = line.indexOf(',', i);
      const end = comma === -1 ? line.length : comma;
      result.push(line.slice(i, end).trim());
      i = comma === -1 ? line.length : comma + 1;
    }
  }
  return result;
}

// ─── YAML Formatter ───────────────────────────────────────────────
export function yamlFormat(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = yaml.load(input);
    const out = yaml.dump(obj, { indent: 2, lineWidth: -1 });
    return { output: out, error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

// ─── YAML → JSON ──────────────────────────────────────────────────
export function yamlToJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = yaml.load(input);
    return { output: JSON.stringify(obj, null, 2), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

// ─── JSON Schema Generator ────────────────────────────────────────
export function jsonSchemaGenerate(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    const schema = inferSchema(obj);
    return { output: JSON.stringify(schema, null, 2), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

function inferSchema(value: unknown): Record<string, unknown> {
  if (value === null) return { type: 'null' };
  if (typeof value === 'boolean') return { type: 'boolean' };
  if (typeof value === 'number') return { type: 'number' };
  if (typeof value === 'string') return { type: 'string' };
  if (Array.isArray(value)) {
    const itemSchema = value.length > 0 ? inferSchema(value[0]) : { type: 'string' };
    return { type: 'array', items: itemSchema };
  }
  if (typeof value === 'object') {
    const props: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      props[k] = inferSchema(v);
      required.push(k);
    }
    return { type: 'object', properties: props, required };
  }
  return { type: 'string' };
}

// ─── JWT Decode ───────────────────────────────────────────────────
export function jwtDecode(input: string): ProcessResult {
  try {
    const trimmed = input.trim();
    if (!trimmed) return { output: '', error: null, errorLine: null };
    const parts = trimmed.split('.');
    if (parts.length < 2) return { output: '', error: 'Invalid JWT: expected header.payload', errorLine: null };
    const base64UrlDecode = (s: string): string => {
      const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const result = { header, payload };
    return { output: JSON.stringify(result, null, 2), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

// ─── XML Formatter ────────────────────────────────────────────────
export function xmlFormat(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    if (doc.querySelector('parsererror')) {
      const msg = doc.querySelector('parsererror')?.textContent ?? 'XML parse error';
      return { output: '', error: msg, errorLine: null };
    }
    const formatted = formatXmlNode(doc.documentElement, 0);
    const decl = input.includes('<?xml') ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
    return { output: decl + formatted, error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

function formatXmlNode(node: Element, depth: number): string {
  const indent = '  '.repeat(depth);
  const attrs = Array.from(node.attributes)
    .map((a) => ` ${a.name}="${a.value.replace(/"/g, '&quot;')}"`)
    .join('');
  const children = Array.from(node.childNodes);
  const textChild = children.find((n) => n.nodeType === Node.TEXT_NODE);
  const text = textChild?.textContent?.trim() ?? '';
  const elemChildren = children.filter((n) => n.nodeType === Node.ELEMENT_NODE);
  if (elemChildren.length === 0) {
    if (text) return `${indent}<${node.tagName}${attrs}>${escapeXml(text)}</${node.tagName}>\n`;
    return `${indent}<${node.tagName}${attrs} />\n`;
  }
  let out = `${indent}<${node.tagName}${attrs}>\n`;
  for (const c of elemChildren) {
    out += formatXmlNode(c as Element, depth + 1);
  }
  return out + `${indent}</${node.tagName}>\n`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── XML Validator ────────────────────────────────────────────────
export function xmlValidate(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    const err = doc.querySelector('parsererror');
    if (err) {
      return { output: '', error: err.textContent ?? 'Invalid XML', errorLine: null };
    }
    return { output: '✓ Valid XML', error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

// ─── XML → JSON ───────────────────────────────────────────────────
export function xmlToJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    if (doc.querySelector('parsererror')) {
      const msg = doc.querySelector('parsererror')?.textContent ?? 'XML parse error';
      return { output: '', error: msg, errorLine: null };
    }
    const obj = xmlElementToJson(doc.documentElement);
    return { output: JSON.stringify(obj, null, 2), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

function xmlElementToJson(el: Element): unknown {
  const attrs: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    attrs[`@${a.name}`] = a.value;
  }
  const childNodes = Array.from(el.childNodes);
  const textNodes = childNodes.filter((n) => n.nodeType === Node.TEXT_NODE);
  const text = textNodes.map((n) => n.textContent?.trim()).join('').trim();
  const elemChildren = childNodes.filter((n) => n.nodeType === Node.ELEMENT_NODE) as Element[];
  if (elemChildren.length === 0) {
    if (Object.keys(attrs).length === 0) return text || {};
    return { ...attrs, _: text || undefined };
  }
  const obj: Record<string, unknown> = { ...attrs };
  for (const c of elemChildren) {
    const key = c.tagName;
    const val = xmlElementToJson(c);
    if (obj[key] === undefined) {
      obj[key] = val;
    } else if (Array.isArray(obj[key])) {
      (obj[key] as unknown[]).push(val);
    } else {
      obj[key] = [obj[key], val];
    }
  }
  return obj;
}

// ─── URL Encode / Decode ──────────────────────────────────────────
export function urlEncode(input: string): ProcessResult {
  try {
    if (!input) return { output: '', error: null, errorLine: null };
    return { output: encodeURIComponent(input), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: String(e), errorLine: null };
  }
}

export function urlDecode(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    return { output: decodeURIComponent(input.replace(/\+/g, ' ')), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: 'Invalid URL-encoded string', errorLine: null };
  }
}

// ─── HTML Formatter ───────────────────────────────────────────────
export function htmlFormat(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const html = doc.documentElement.outerHTML;
    // Simple indent formatter: add newlines and indent
    let out = '';
    let indent = 0;
    const parts = html.replace(/>\s*</g, '>\n<').split('\n');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
      out += '  '.repeat(indent) + trimmed + '\n';
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?') && !trimmed.endsWith('/>') && !/^<(meta|link|br|hr|input|img)\s/i.test(trimmed)) {
        indent++;
      }
    }
    return { output: out.trimEnd(), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e), errorLine: null };
  }
}

// ─── Base64 Encode / Decode ──────────────────────────────────────

export function base64Encode(input: string): ProcessResult {
  try {
    if (!input) return { output: '', error: null, errorLine: null };
    const encoded = btoa(
      new TextEncoder()
        .encode(input)
        .reduce((s, b) => s + String.fromCharCode(b), '')
    );
    return { output: encoded, error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: String(e), errorLine: null };
  }
}

export function base64Decode(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const binary = atob(input.trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return { output: decoded, error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: 'Invalid Base64 string', errorLine: null };
  }
}

// ─── JSON to code (language converters) ──────────────────────────
function jsonToCodeProcessor(
  input: string,
  fn: (input: string) => string
): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const out = fn(input);
    return { output: out, error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

export function jsonToTypeScript(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToTypeScript);
}
export function jsonToPython(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToPython);
}
export function jsonToJava(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToJava);
}
export function jsonToGo(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToGo);
}
export function jsonToCsharp(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToCsharp);
}
export function jsonToDart(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToDart);
}
export function jsonToRust(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToRust);
}
export function jsonToKotlin(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToKotlin);
}
export function jsonToSwift(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToSwift);
}
export function jsonToPhp(input: string): ProcessResult {
  return jsonToCodeProcessor(input, jsonToCode.jsonToPhp);
}

// ─── JSON utilities (Phase 2) ─────────────────────────────────────
export function sortJson(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const obj = JSON.parse(input);
    const sorted = sortKeys(obj);
    return { output: JSON.stringify(sorted, null, 2), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

function sortKeys(value: unknown): unknown {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortKeys((value as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  if (Array.isArray(value)) return value.map(sortKeys);
  return value;
}

export function jsonEscape(input: string): ProcessResult {
  try {
    return { output: JSON.stringify(input), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: String(e), errorLine: null };
  }
}

export function jsonUnescape(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const t = input.trim();
    if (t.startsWith('"') && t.endsWith('"')) {
      const parsed = JSON.parse(t);
      return { output: typeof parsed === 'string' ? parsed : JSON.stringify(parsed), error: null, errorLine: null };
    }
    const unescaped = t
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r');
    return { output: unescaped, error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: 'Invalid or unsupported escape sequence', errorLine: null };
  }
}

export function jsonToHtmlTable(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const data = JSON.parse(input);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return { output: '<table></table>', error: null, errorLine: null };
    const headers = Array.from(new Set(arr.flatMap((row: Record<string, unknown>) => Object.keys(row))));
    const escape = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const head = `<thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join('')}</tr></thead>`;
    const rows = arr.map(
      (row: Record<string, unknown>) =>
        `<tr>${headers.map((h) => `<td>${escape(row[h])}</td>`).join('')}</tr>`
    );
    const body = `<tbody>${rows.join('')}</tbody>`;
    return { output: `<table>\n${head}\n${body}\n</table>`, error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

export function jsonToSql(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const data = JSON.parse(input);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return { output: '-- No rows', error: null, errorLine: null };
    const tableName = 'data';
    const keys = Array.from(new Set(arr.flatMap((row: Record<string, unknown>) => Object.keys(row))));
    const cols = keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(', ');
    const lines = arr.map((row: Record<string, unknown>) => {
      const vals = keys.map((k) => {
        const v = row[k];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return String(v);
        if (typeof v === 'boolean') return v ? '1' : '0';
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${tableName} (${cols}) VALUES (${vals.join(', ')});`;
    });
    return { output: lines.join('\n'), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

export function jsonToTsv(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: null, errorLine: null };
    const data = JSON.parse(input);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return { output: '', error: null, errorLine: null };
    const headers = Array.from(new Set(arr.flatMap((row: Record<string, unknown>) => Object.keys(row))));
    const escapeTsv = (v: unknown) => {
      const s = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
      return s.includes('\t') || s.includes('\n') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [
      headers.join('\t'),
      ...arr.map((row: Record<string, unknown>) => headers.map((h) => escapeTsv(row[h])).join('\t')),
    ];
    return { output: rows.join('\n'), error: null, errorLine: null };
  } catch (e) {
    return parseJsonError(e);
  }
}

// ─── Utility: Lorem Ipsum ─────────────────────────────────────────
const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export function loremIpsum(input: string): ProcessResult {
  const n = Math.min(20, Math.max(1, parseInt(input.trim(), 10) || 3));
  const paras = Array.from({ length: n }, () => LOREM);
  return { output: paras.join('\n\n'), error: null, errorLine: null };
}

// ─── Utility: UUID Generator ──────────────────────────────────────
export function uuidGenerator(input: string): ProcessResult {
  const count = Math.min(50, Math.max(1, parseInt(input.trim(), 10) || 1));
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : fallbackUuid());
  }
  return { output: uuids.join('\n'), error: null, errorLine: null };
}
function fallbackUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Utility: Random JSON Generator ─────────────────────────────────
export function randomJsonGenerator(input: string): ProcessResult {
  const size = Math.min(20, Math.max(1, parseInt(input.trim(), 10) || 5));
  const obj: Record<string, unknown> = {};
  const keys = ['id', 'name', 'value', 'count', 'active', 'tags', 'items', 'data'];
  for (let i = 0; i < size; i++) {
    const k = keys[i % keys.length] + (i >= keys.length ? i : '');
    const r = Math.random();
    if (r < 0.3) obj[k] = Math.floor(Math.random() * 1000);
    else if (r < 0.5) obj[k] = Math.random() > 0.5;
    else if (r < 0.7) obj[k] = `value_${Math.random().toString(36).slice(2, 8)}`;
    else if (r < 0.85) obj[k] = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => Math.floor(Math.random() * 100));
    else obj[k] = null;
  }
  return { output: JSON.stringify(obj, null, 2), error: null, errorLine: null };
}

// ─── Utility: Timestamp Converter ───────────────────────────────────
export function timestampConverter(input: string): ProcessResult {
  const t = input.trim();
  if (!t) {
    const now = Date.now();
    return {
      output: `Current timestamp (ms): ${now}\nCurrent timestamp (sec): ${Math.floor(now / 1000)}\nISO: ${new Date(now).toISOString()}`,
      error: null,
      errorLine: null,
    };
  }
  const num = /^\d+$/.test(t) ? parseInt(t, 10) : NaN;
  if (!Number.isNaN(num)) {
    const ms = num <= 1e12 ? num * 1000 : num;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return { output: '', error: 'Invalid timestamp', errorLine: null };
    return {
      output: `ISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nUnix (ms): ${d.getTime()}\nUnix (sec): ${Math.floor(d.getTime() / 1000)}`,
      error: null,
      errorLine: null,
    };
  }
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return { output: '', error: 'Invalid date string or timestamp', errorLine: null };
  return {
    output: `Unix (ms): ${d.getTime()}\nUnix (sec): ${Math.floor(d.getTime() / 1000)}\nISO: ${d.toISOString()}`,
    error: null,
    errorLine: null,
  };
}

// ─── Utility: Regex Tester ──────────────────────────────────────────
export function regexTester(input: string): ProcessResult {
  const lines = input.trim().split(/\n/);
  let regexStr = lines[0]?.trim() ?? '';
  const testStr = lines.slice(1).join('\n').trim();
  if (!regexStr) return { output: '', error: 'Enter a regex on the first line', errorLine: null };
  const slashMatch = regexStr.match(/^\/(.*)\/([gimsuy]*)$/);
  if (slashMatch) {
    regexStr = slashMatch[1]!.replace(/\\\//g, '/');
  }
  const flags = slashMatch?.[2] || 'g';
  try {
    const re2 = new RegExp(regexStr, flags);
    const matches: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re2.exec(testStr)) !== null) {
      matches.push(`Match: "${m[0]}" at index ${m.index}${m.length > 1 ? ' Groups: ' + m.slice(1).map((g, i) => `$${i + 1}=${JSON.stringify(g)}`).join(', ') : ''}`);
    }
    if (matches.length === 0) return { output: 'No matches.', error: null, errorLine: null };
    return { output: matches.join('\n'), error: null, errorLine: null };
  } catch (e) {
    return { output: '', error: 'Invalid regex: ' + (e instanceof Error ? e.message : String(e)), errorLine: null };
  }
}

// ─── Utility: JWT Generator (unsigned / placeholder) ─────────────────
export function jwtGenerator(input: string): ProcessResult {
  try {
    if (!input.trim()) return { output: '', error: 'Paste a JSON payload (e.g. {"sub":"user123","exp":...})', errorLine: null };
    const payload = JSON.parse(input.trim());
    const header = { alg: 'HS256', typ: 'JWT' };
    const b64 = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const part1 = b64(JSON.stringify(header));
    const part2 = b64(JSON.stringify(payload));
    const unsigned = `${part1}.${part2}.`;
    return {
      output: unsigned + '(add signature with a secret in your app)',
      error: null,
      errorLine: null,
    };
  } catch (e) {
    return { output: '', error: 'Invalid JSON payload: ' + (e instanceof Error ? e.message : String(e)), errorLine: null };
  }
}

// ─── Utility: Hash (MD5 via simple impl; SHA via Web Crypto async) ───
function md5Hex(s: string): string {
  const utf8 = new TextEncoder().encode(s);
  const bytes = Array.from(utf8);
  const k: number[] = [];
  for (let i = 0; i < 64; i++) k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const G = (x: number, y: number, z: number) => (z & x) | (~z & y);
  const H = (x: number, y: number, z: number) => x ^ y ^ z;
  const I = (x: number, y: number, z: number) => y ^ (x | ~z);
  const rot = (v: number, n: number) => (v << n) | (v >>> (32 - n));
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;
  const len = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push((len >>> (i * 8)) & 0xff);
  for (let off = 0; off < bytes.length; off += 64) {
    const w: number[] = [];
    for (let i = 0; i < 16; i++)
      w[i] = bytes[off + i * 4]! | (bytes[off + i * 4 + 1]! << 8) | (bytes[off + i * 4 + 2]! << 16) | (bytes[off + i * 4 + 3]! << 24);
    let a = h0, b = h1, c = h2, d = h3;
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) { f = F(b, c, d); g = i; }
      else if (i < 32) { f = G(b, c, d); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = H(b, c, d); g = (3 * i + 5) % 16; }
      else { f = I(b, c, d); g = (7 * i) % 16; }
      const t = (a + f + k[i]! + (w[g] ?? 0)) >>> 0;
      a = d; d = c; c = b; b = (b + rot(t, [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21][i]!)) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
  }
  const hex = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff].map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex(h0) + hex(h1) + hex(h2) + hex(h3);
}
export function hashGenerator(input: string): ProcessResult | Promise<ProcessResult> {
  if (!input.trim()) return { output: '', error: null, errorLine: null };
  const md5 = md5Hex(input);
  return (async () => {
    let sha256 = '';
    try {
      const buf = new TextEncoder().encode(input);
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      sha256 = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      sha256 = '(SHA-256 requires secure context)';
    }
    return { output: `MD5: ${md5}\nSHA-256: ${sha256}`, error: null, errorLine: null };
  })();
}

// ─── Utility: Color Converter ───────────────────────────────────────
function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace(/^#/, '').match(/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
export function colorConverter(input: string): ProcessResult {
  const t = input.trim();
  if (!t) return { output: '', error: null, errorLine: null };
  let r = 0, g = 0, b = 0;
  const hexMatch = t.match(/#([0-9a-fA-F]{6})/);
  const rgbMatch = t.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  const hslMatch = t.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
  if (hexMatch) {
    const c = parseHex('#' + hexMatch[1]);
    if (!c) return { output: '', error: 'Invalid hex', errorLine: null };
    r = c.r; g = c.g; b = c.b;
  } else if (rgbMatch) {
    r = parseInt(rgbMatch[1], 10); g = parseInt(rgbMatch[2], 10); b = parseInt(rgbMatch[3], 10);
  } else if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360, s = parseInt(hslMatch[2], 10) / 100, l = parseInt(hslMatch[3], 10) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    r = f(0) * 255; g = f(8) * 255; b = f(4) * 255;
  } else {
    const c = parseHex(t);
    if (!c) return { output: '', error: 'Enter a hex (#RRGGBB), rgb(r,g,b), or hsl(h,s%,l%)', errorLine: null };
    r = c.r; g = c.g; b = c.b;
  }
  const [hh, ss, ll] = rgbToHsl(r, g, b);
  const out = [
    `Hex: ${rgbToHex(r, g, b)}`,
    `RGB: rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
    `HSL: hsl(${hh}, ${ss}%, ${ll}%)`,
  ].join('\n');
  return { output: out, error: null, errorLine: null };
}

// ─── Utility: Text Case Converter ───────────────────────────────────
export function textCaseConverter(input: string): ProcessResult {
  if (!input.trim()) return { output: '', error: null, errorLine: null };
  const s = input.trim();
  const lower = s.toLowerCase();
  const upper = s.toUpperCase();
  const title = s.replace(/\b\w/g, (c) => c.toUpperCase());
  const camel = s.toLowerCase().replace(/[\s_-]+(\w)/g, (_, c) => (c as string).toUpperCase()).replace(/^\w/, (c) => (c as string).toLowerCase());
  const snake = s.replace(/\s+/g, '_').replace(/-/g, '_').toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  const kebab = s.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/-+/g, '-').replace(/^-/, '');
  const lines = [
    `lowercase: ${lower}`,
    `UPPERCASE: ${upper}`,
    `Title Case: ${title}`,
    `camelCase: ${camel}`,
    `snake_case: ${snake}`,
    `kebab-case: ${kebab}`,
  ];
  return { output: lines.join('\n'), error: null, errorLine: null };
}

// ─── Helpers ─────────────────────────────────────────────────────
function parseJsonError(e: unknown): ProcessResult {
  const msg = e instanceof Error ? e.message : String(e);
  const lineMatch = msg.match(/position\s+(\d+)/i);
  let errorLine: number | null = null;
  if (lineMatch) {
    // position is character offset — approximate line from that
    errorLine = null; // browser engines report position, not line
  }
  return { output: '', error: msg, errorLine };
}
