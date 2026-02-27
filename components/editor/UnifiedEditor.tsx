'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Mode,
  SelectionType,
  createJSONEditor,
  jmespathQueryLanguage,
  jsonpathQueryLanguage,
  toTextContent,
  type Content,
  type JsonEditor,
  type JSONEditorPropsOptional,
  type TextSelection,
  type Validator,
} from 'vanilla-jsoneditor';
import { useWorkspaceStore, type ToolSearchState } from '@/lib/store';
import { getInputPlaceholder } from '@/lib/input-placeholders';
import { getEditorCapabilities } from '@/lib/editor-capabilities';
import { applyTransform, executeQuery, type TransformAction } from '@/lib/editor-transforms';
import UnifiedEditorToolbar from './UnifiedEditorToolbar';
import UnifiedSearchPanel from './UnifiedSearchPanel';

type SearchMatch = { start: number; end: number };

interface UnifiedEditorProps {
  toolId: string;
  language?: string;
  onChange?: (value: string) => void;
  variant?: 'left' | 'right';
  readOnly?: boolean;
  validator?: Validator;
}

const DEFAULT_SEARCH_STATE: ToolSearchState = {
  open: false,
  query: '',
  replaceText: '',
  useRegex: false,
  matchCase: false,
  wholeWord: false,
  resultCount: 0,
  activeResultIndex: -1,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSearchRegex(
  query: string,
  options: Pick<ToolSearchState, 'useRegex' | 'matchCase' | 'wholeWord'>,
  global = true
): RegExp {
  const source = options.useRegex ? query : escapeRegExp(query);
  const wrapped = options.wholeWord ? `\\b(?:${source})\\b` : source;
  const flags = `${global ? 'g' : ''}${options.matchCase ? '' : 'i'}`;
  return new RegExp(wrapped, flags);
}

function findMatches(
  text: string,
  query: string,
  options: Pick<ToolSearchState, 'useRegex' | 'matchCase' | 'wholeWord'>
): { matches: SearchMatch[]; error: string | null } {
  if (!query) {
    return { matches: [], error: null };
  }

  try {
    const regex = buildSearchRegex(query, options, true);
    const matches: SearchMatch[] = [];
    let current: RegExpExecArray | null = regex.exec(text);

    while (current !== null) {
      const start = current.index;
      const end = start + current[0].length;

      if (end > start) {
        matches.push({ start, end });
      }

      // Guard against zero-length infinite loops.
      if (current[0].length === 0) {
        regex.lastIndex += 1;
      }

      if (matches.length >= 5000) {
        break;
      }

      current = regex.exec(text);
    }

    return { matches, error: null };
  } catch (error) {
    return {
      matches: [],
      error: error instanceof Error ? error.message : 'Invalid search pattern',
    };
  }
}

function buildEditorContent(value: string, mode: 'text' | 'tree' | 'table'): Content {
  if (mode === 'text') {
    return { text: value };
  }

  try {
    return { json: JSON.parse(value || 'null') };
  } catch {
    return { text: value };
  }
}

function buildTextSelection(start: number, end: number): TextSelection {
  return {
    type: SelectionType.text,
    ranges: [{ anchor: start, head: end }],
    main: 0,
  };
}

export default function UnifiedEditor({
  toolId,
  language = 'json',
  onChange,
  variant = 'left',
  readOnly = false,
  validator,
}: UnifiedEditorProps) {
  const capabilities = getEditorCapabilities(toolId);

  const toolData = useWorkspaceStore((s) => s.toolData[toolId]);
  const setInput = useWorkspaceStore((s) => s.setInput);
  const setInput2 = useWorkspaceStore((s) => s.setInput2);
  const theme = useWorkspaceStore((s) => s.theme);
  const panelFullscreen = useWorkspaceStore((s) => s.panelFullscreen);
  const setPanelFullscreen = useWorkspaceStore((s) => s.setPanelFullscreen);
  const addToast = useWorkspaceStore((s) => s.addToast);

  const editorMode = useWorkspaceStore(
    (s) => s.editorModeByTool[toolId] ?? capabilities.defaultMode
  );
  const setEditorMode = useWorkspaceStore((s) => s.setEditorMode);

  const searchState = useWorkspaceStore(
    (s) => s.searchStateByTool[toolId] ?? DEFAULT_SEARCH_STATE
  );
  const setSearchState = useWorkspaceStore((s) => s.setSearchState);

  const editorPanelState = useWorkspaceStore((s) => s.editorPanelStateByTool[toolId]);
  const setEditorPanelState = useWorkspaceStore((s) => s.setEditorPanelState);

  const value = variant === 'right' ? toolData?.input2 ?? '' : toolData?.input ?? '';
  const setValue = variant === 'right' ? setInput2 : setInput;

  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JsonEditor | null>(null);
  const latestValueRef = useRef(value);

  const [focused, setFocused] = useState(false);
  const [searchFocusSignal, setSearchFocusSignal] = useState(0);
  const [queryEngine, setQueryEngine] = useState<'jsonpath' | 'jmespath'>('jsonpath');
  const [queryText, setQueryText] = useState('');
  const [queryOutput, setQueryOutput] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const [queryElapsedMs, setQueryElapsedMs] = useState<number | null>(null);

  const resolvedMode = useMemo(() => {
    if (capabilities.allowedModes.includes(editorMode)) {
      return editorMode;
    }

    return capabilities.defaultMode;
  }, [capabilities.allowedModes, capabilities.defaultMode, editorMode]);

  const fullScreenTarget = readOnly ? 'output' : 'input';
  const isFullscreen = panelFullscreen === fullScreenTarget;

  const placeholder =
    variant === 'right' && (toolId === 'json-diff' || toolId === 'json-compare')
      ? 'Paste modified JSON here to compare differences'
      : getInputPlaceholder(toolId);
  const showPlaceholder = !value.trim() && !focused;

  const findState = useMemo(
    () =>
      findMatches(value, searchState.query, {
        useRegex: searchState.useRegex,
        matchCase: searchState.matchCase,
        wholeWord: searchState.wholeWord,
      }),
    [
      value,
      searchState.query,
      searchState.useRegex,
      searchState.matchCase,
      searchState.wholeWord,
    ]
  );

  const queryOpen = editorPanelState?.transformOpen ?? false;

  const persistValue = useCallback(
    (nextValue: string) => {
      latestValueRef.current = nextValue;
      setValue(toolId, nextValue);
      onChange?.(nextValue);
    },
    [onChange, setValue, toolId]
  );

  const selectSearchIndex = useCallback(
    (index: number) => {
      if (resolvedMode !== 'text') return;
      const match = findState.matches[index];
      if (!match || !editorRef.current) return;

      editorRef.current.select(buildTextSelection(match.start, match.end));
    },
    [findState.matches, resolvedMode]
  );

  const setSearch = useCallback(
    (next: Partial<ToolSearchState>) => {
      const shouldResetActive =
        !('activeResultIndex' in next) &&
        ('query' in next || 'useRegex' in next || 'matchCase' in next || 'wholeWord' in next);

      const payload = shouldResetActive
        ? { ...next, activeResultIndex: -1 }
        : next;

      setSearchState(toolId, payload);
      if ('open' in payload) {
        setEditorPanelState(toolId, { searchOpen: Boolean(payload.open) });
      }
    },
    [setEditorPanelState, setSearchState, toolId]
  );

  const goToIndex = useCallback(
    (nextIndex: number) => {
      setSearch({ activeResultIndex: nextIndex });
      selectSearchIndex(nextIndex);
    },
    [selectSearchIndex, setSearch]
  );

  const goToNext = useCallback(() => {
    if (findState.matches.length === 0) return;

    const current = searchState.activeResultIndex;
    const next = current >= findState.matches.length - 1 ? 0 : current + 1;
    goToIndex(next);
  }, [findState.matches.length, goToIndex, searchState.activeResultIndex]);

  const goToPrev = useCallback(() => {
    if (findState.matches.length === 0) return;

    const current = searchState.activeResultIndex;
    const next = current <= 0 ? findState.matches.length - 1 : current - 1;
    goToIndex(next);
  }, [findState.matches.length, goToIndex, searchState.activeResultIndex]);

  const replaceCurrent = useCallback(() => {
    if (readOnly || resolvedMode !== 'text') return;

    const active = searchState.activeResultIndex;
    const match = findState.matches[active];
    if (!match || !searchState.query) return;

    let replacement = searchState.replaceText;
    if (searchState.useRegex) {
      try {
        const localRegex = buildSearchRegex(
          searchState.query,
          {
            useRegex: true,
            matchCase: searchState.matchCase,
            wholeWord: searchState.wholeWord,
          },
          false
        );
        replacement = value.slice(match.start, match.end).replace(localRegex, searchState.replaceText);
      } catch {
        return;
      }
    }

    const nextValue =
      value.slice(0, match.start) + replacement + value.slice(match.end);

    persistValue(nextValue);
  }, [
    findState.matches,
    persistValue,
    readOnly,
    resolvedMode,
    searchState.activeResultIndex,
    searchState.matchCase,
    searchState.query,
    searchState.replaceText,
    searchState.useRegex,
    searchState.wholeWord,
    value,
  ]);

  const replaceAll = useCallback(() => {
    if (readOnly || resolvedMode !== 'text' || !searchState.query) return;

    try {
      const regex = buildSearchRegex(
        searchState.query,
        {
          useRegex: searchState.useRegex,
          matchCase: searchState.matchCase,
          wholeWord: searchState.wholeWord,
        },
        true
      );

      const nextValue = value.replace(regex, searchState.replaceText);
      if (nextValue !== value) {
        persistValue(nextValue);
      }
    } catch {
      // Search panel already surfaces invalid regex state.
    }
  }, [
    persistValue,
    readOnly,
    resolvedMode,
    searchState.matchCase,
    searchState.query,
    searchState.replaceText,
    searchState.useRegex,
    searchState.wholeWord,
    value,
  ]);

  const toggleSearchPanel = useCallback(() => {
    const nextOpen = !searchState.open;
    setSearch({ open: nextOpen });
    if (nextOpen) {
      setSearchFocusSignal((n) => n + 1);
    }

    if (nextOpen && resolvedMode !== 'text' && capabilities.allowedModes.includes('text')) {
      setEditorMode(toolId, 'text');
    }
  }, [
    capabilities.allowedModes,
    resolvedMode,
    searchState.open,
    setEditorMode,
    setSearch,
    toolId,
  ]);

  const onTransform = useCallback(
    (action: TransformAction) => {
      const result = applyTransform(value, action);
      if (result.error) {
        addToast(result.error, 'error');
        return;
      }

      persistValue(result.output);
      if (action === 'format' && resolvedMode !== 'text') {
        setEditorMode(toolId, 'text');
      }
      addToast(`Applied ${action}`, 'success');
    },
    [addToast, persistValue, resolvedMode, setEditorMode, toolId, value]
  );

  const runQuery = useCallback(() => {
    if (!queryText.trim()) {
      setQueryError('Enter a query expression');
      setQueryOutput('');
      setQueryElapsedMs(null);
      return;
    }

    const result = executeQuery(value, queryText, queryEngine);
    setQueryError(result.error);
    setQueryOutput(result.output);
    setQueryElapsedMs(result.elapsedMs);
  }, [queryEngine, queryText, value]);

  useEffect(() => {
    if (!hostRef.current) return;

    const initialProps: JSONEditorPropsOptional = {
      content: buildEditorContent(value, resolvedMode),
      mode: resolvedMode as Mode,
      readOnly,
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      askToFormat: false,
      validator,
      queryLanguages: [jsonpathQueryLanguage, jmespathQueryLanguage],
      onChange: (content) => {
        const text = toTextContent(content).text;
        persistValue(text);
      },
      onChangeMode: (nextMode) => {
        setEditorMode(toolId, nextMode as 'text' | 'tree' | 'table');
      },
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    };

    editorRef.current = createJSONEditor({
      target: hostRef.current,
      props: initialProps,
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [toolId, variant]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updates: JSONEditorPropsOptional = {
      mode: resolvedMode as Mode,
      readOnly,
      validator,
    };

    if (value !== latestValueRef.current) {
      updates.content = buildEditorContent(value, resolvedMode);
      latestValueRef.current = value;
    }

    editor.updateProps(updates);
  }, [readOnly, resolvedMode, validator, value]);

  useEffect(() => {
    const resultCount = findState.matches.length;
    let nextActive = searchState.activeResultIndex;

    if (resultCount === 0) {
      nextActive = -1;
    } else if (nextActive >= resultCount) {
      nextActive = -1;
    }

    if (
      searchState.resultCount !== resultCount ||
      searchState.activeResultIndex !== nextActive
    ) {
      setSearch({
        resultCount,
        activeResultIndex: nextActive,
      });
    }
  }, [
    findState.matches.length,
    searchState.activeResultIndex,
    searchState.resultCount,
    setSearch,
  ]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const withinPanel = !!(target && rootRef.current?.contains(target));
      const typingTarget =
        !!target &&
        (target.closest('input, textarea, select') !== null || target.isContentEditable);

      if (mod && event.key.toLowerCase() === 'f' && (focused || withinPanel)) {
        event.preventDefault();
        event.stopPropagation();
        setSearch({ open: true });
        setSearchFocusSignal((n) => n + 1);
        if (resolvedMode !== 'text' && capabilities.allowedModes.includes('text')) {
          setEditorMode(toolId, 'text');
        }
        return;
      }

      if (searchState.open && event.key === 'Escape') {
        event.preventDefault();
        setSearch({ open: false });
        return;
      }

      if (typingTarget) {
        return;
      }

      if (searchState.open && event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) {
          goToPrev();
        } else {
          goToNext();
        }
        return;
      }

      if (event.key === 'F3' && (focused || searchState.open)) {
        event.preventDefault();
        event.stopPropagation();
        if (event.shiftKey) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [
    capabilities.allowedModes,
    focused,
    goToNext,
    goToPrev,
    resolvedMode,
    searchState.open,
    setEditorMode,
    setSearch,
    toolId,
  ]);

  return (
    <div ref={rootRef} className="dt-unified-editor flex flex-col h-full rounded-dt-lg overflow-hidden bg-dt-card/92 backdrop-blur-dt border border-dt-border shadow-dt-panel transition-all duration-200 hover:shadow-dt-soft focus-within:shadow-dt-soft">
      <UnifiedEditorToolbar
        label={language === 'json' ? undefined : language.toUpperCase()}
        mode={resolvedMode}
        allowedModes={capabilities.allowedModes}
        showModeSwitch={capabilities.supportsModeSwitch}
        showTransformActions={capabilities.supportsTransforms && !readOnly}
        showQueryAction={capabilities.supportsQuery && !readOnly}
        readOnly={readOnly}
        searchOpen={searchState.open}
        queryOpen={queryOpen}
        onModeChange={(mode) => setEditorMode(toolId, mode)}
        onToggleSearch={toggleSearchPanel}
        onToggleQuery={() => {
          setEditorPanelState(toolId, { transformOpen: !queryOpen });
        }}
        onTransform={onTransform}
        onToggleFullscreen={() =>
          setPanelFullscreen(isFullscreen ? 'none' : fullScreenTarget)
        }
        isFullscreen={isFullscreen}
      />

      <UnifiedSearchPanel
        open={searchState.open}
        focusSignal={searchFocusSignal}
        state={searchState}
        disabled={resolvedMode !== 'text'}
        error={findState.error}
        onChange={setSearch}
        onClose={() => setSearch({ open: false })}
        onNext={goToNext}
        onPrev={goToPrev}
        onReplace={replaceCurrent}
        onReplaceAll={replaceAll}
      />

      {queryOpen ? (
        <div className="border-b border-dt-border bg-dt-surface/95 px-3 py-2.5 backdrop-blur-dt-sm">
          <div className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
            <select
              value={queryEngine}
              onChange={(e) => setQueryEngine(e.target.value as 'jsonpath' | 'jmespath')}
              className="h-8 rounded-xl border border-dt-border bg-dt-card px-2 text-sm text-dt-text"
            >
              <option value="jsonpath">JSONPath</option>
              <option value="jmespath">JMESPath</option>
            </select>
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={queryEngine === 'jsonpath' ? '$.items[*]' : 'items[*].name'}
              className="h-8 rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted"
            />
            <button
              type="button"
              onClick={runQuery}
              className="text-xs px-3 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200"
            >
              Run Query
            </button>
          </div>

          {queryElapsedMs !== null ? (
            <div className="mt-2 text-[11px] text-dt-text-dim tabular-nums">
              Executed in {queryElapsedMs} ms
            </div>
          ) : null}
          {queryError ? <div className="mt-2 text-xs text-dt-error">{queryError}</div> : null}
          {queryOutput ? (
            <pre className="mt-2 max-h-36 overflow-auto rounded-xl border border-dt-border bg-dt-card p-2 text-[11px] text-dt-text">
              {queryOutput}
            </pre>
          ) : null}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 relative">
        <div
          className={`absolute inset-0 flex items-center justify-center px-8 text-center pointer-events-none z-10 text-sm text-dt-text-muted leading-relaxed transition-opacity duration-200 ${
            showPlaceholder ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
        >
          {placeholder}
        </div>
        <div ref={hostRef} className="h-full w-full dt-unified-editor-host" />
      </div>
    </div>
  );
}
