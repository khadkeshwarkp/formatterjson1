import type { EditorMode } from '@/lib/store';

export const JSON_TOOL_GROUP_PHASE1 = new Set<string>([
  'json-formatter',
  'json-validator',
  'json-minifier',
  'json-parser',
  'json-viewer',
  'json-pretty-print',
  'json-editor',
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

  return {
    useUnifiedEditor: unifiedEnabled && inJsonPhase1,
    supportsModeSwitch: inJsonPhase1,
    supportsSearchReplace: true,
    supportsQuery: inJsonPhase1,
    supportsTransforms: inJsonPhase1,
    defaultMode: 'text',
    allowedModes: inJsonPhase1 ? ['text', 'tree', 'table'] : ['text'],
    queryEngines: ['jsonpath', 'jmespath'],
  };
}

export function shouldUseUnifiedEditor(toolId: string): boolean {
  return getEditorCapabilities(toolId).useUnifiedEditor;
}

export function isDiffCompareTool(toolId: string): boolean {
  return DIFF_COMPARE_TOOL_GROUP.has(toolId);
}
