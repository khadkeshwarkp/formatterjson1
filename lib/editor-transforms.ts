import jmespath from 'jmespath';
import { JSONPath } from 'jsonpath-plus';
import { jsonrepair } from 'jsonrepair';
import { parse as losslessParse, stringify as losslessStringify } from 'lossless-json';
import type { QueryEngine } from '@/lib/editor-capabilities';

export type TransformAction =
  | 'format'
  | 'minify'
  | 'sortKeys'
  | 'repair'
  | 'losslessFormat';

export interface TransformResult {
  output: string;
  error: string | null;
}

export interface QueryExecutionResult {
  output: string;
  error: string | null;
  elapsedMs: number;
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => [key, sortJsonValue(val)]);

    return Object.fromEntries(entries);
  }

  return value;
}

export function applyTransform(text: string, action: TransformAction): TransformResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { output: '', error: null };
  }

  try {
    if (action === 'repair') {
      const repaired = jsonrepair(text);
      const formatted = JSON.stringify(JSON.parse(repaired), null, 2);
      return { output: formatted, error: null };
    }

    if (action === 'losslessFormat') {
      const parsed = losslessParse(text);
      const formatted = losslessStringify(parsed, null, 2);
      return {
        output: formatted ?? text,
        error: null,
      };
    }

    const parsed = JSON.parse(text) as unknown;

    if (action === 'minify') {
      return { output: JSON.stringify(parsed), error: null };
    }

    if (action === 'sortKeys') {
      const sorted = sortJsonValue(parsed);
      return { output: JSON.stringify(sorted, null, 2), error: null };
    }

    return { output: JSON.stringify(parsed, null, 2), error: null };
  } catch (error) {
    return {
      output: text,
      error: error instanceof Error ? error.message : 'Failed to transform JSON',
    };
  }
}

export function executeQuery(
  text: string,
  query: string,
  engine: QueryEngine
): QueryExecutionResult {
  const started = performance.now();

  try {
    const parsed = JSON.parse(text);
    let result: unknown;

    if (engine === 'jsonpath') {
      result = JSONPath({ path: query, json: parsed, wrap: true });
    } else {
      result = jmespath.search(parsed, query);
    }

    return {
      output: JSON.stringify(result, null, 2),
      error: null,
      elapsedMs: Math.round((performance.now() - started) * 100) / 100,
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Failed to execute query',
      elapsedMs: Math.round((performance.now() - started) * 100) / 100,
    };
  }
}
