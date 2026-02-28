import type { EditorMode } from '@/lib/store';

export const JSON_TOOL_GROUP_PHASE1 = new Set<string>([
  'json-formatter',
  'json-validator',
  'json-minifier',
  'json-parser',
  'json-viewer',
  'json-pretty-print',
  'json-editor',
  'json-to-string',
  'string-to-json',
  'json-string-to-object',
  'parse-json-string',
]);

const TEXT_ONLY_JSON_TOOLS = new Set<string>([
  'string-to-json',
  'json-string-to-object',
  'parse-json-string',
]);

export const DIFF_COMPARE_TOOL_GROUP = new Set<string>(['json-diff', 'json-compare']);

export type QueryEngine = 'jsonpath' | 'jmespath';

export interface EditorCapabilities {
  useUnifiedEditor: boolean;
  supportsModeSwitch: boolean;
  supportsSearchReplace: boolean;
  supportsQuery: boolean;
  supportsTransforms: boolean;
  defaultMode: EditorMode;
  allowedModes: EditorMode[];
  queryEngines: QueryEngine[];
}

export function isEditorV2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_EDITOR_V2 !== 'false';
}

export function getEditorCapabilities(toolId: string): EditorCapabilities {
  const unifiedEnabled = isEditorV2Enabled();
  const inJsonPhase1 = JSON_TOOL_GROUP_PHASE1.has(toolId);
  const textOnly = TEXT_ONLY_JSON_TOOLS.has(toolId);
  const allowedModes: EditorMode[] = !inJsonPhase1
    ? ['text']
    : textOnly
      ? ['text']
      : ['text', 'tree', 'table'];

  return {
    useUnifiedEditor: unifiedEnabled && inJsonPhase1,
    supportsModeSwitch: allowedModes.length > 1,
    supportsSearchReplace: true,
    supportsQuery: inJsonPhase1,
    supportsTransforms: inJsonPhase1,
    defaultMode: 'text',
    allowedModes,
    queryEngines: ['jsonpath', 'jmespath'],
  };
}

export function shouldUseUnifiedEditor(toolId: string): boolean {
  return getEditorCapabilities(toolId).useUnifiedEditor;
}

export function isDiffCompareTool(toolId: string): boolean {
  return DIFF_COMPARE_TOOL_GROUP.has(toolId);
}
