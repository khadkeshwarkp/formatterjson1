'use client';

import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { getInputPlaceholder } from '@/lib/input-placeholders';
import { defineWorkspaceMonacoThemes, getMonacoTheme } from '@/lib/monaco-theme';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoWrapperProps {
  toolId: string;
  language?: string;
  onChange?: (value: string) => void;
  variant?: 'left' | 'right';
}

interface SearchMatch {
  start: number;
  end: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSearchRegex(
  query: string,
  options: { useRegex: boolean; matchCase: boolean; wholeWord: boolean },
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
  options: { useRegex: boolean; matchCase: boolean; wholeWord: boolean }
): { matches: SearchMatch[]; error: string | null } {
  if (!query) return { matches: [], error: null };

  try {
    const regex = buildSearchRegex(query, options, true);
    const matches: SearchMatch[] = [];
    let current = regex.exec(text);
    while (current) {
      const start = current.index;
      const end = start + current[0].length;
      if (end > start) {
        matches.push({ start, end });
      }
      if (current[0].length === 0) {
        regex.lastIndex += 1;
      }
      if (matches.length >= 5000) break;
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

function PlaceholderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-dt-text">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function MonacoWrapper({ toolId, language = 'json', onChange, variant = 'left' }: MonacoWrapperProps) {
  const theme = useWorkspaceStore((s) => s.theme);
  const toolData = useWorkspaceStore((s) => s.toolData[toolId]);
  const setInput = useWorkspaceStore((s) => s.setInput);
  const setInput2 = useWorkspaceStore((s) => s.setInput2);
  const value = variant === 'right' ? (toolData?.input2 ?? '') : (toolData?.input ?? '');
  const setValue = variant === 'right' ? setInput2 : setInput;
  const setPanelFullscreen = useWorkspaceStore((s) => s.setPanelFullscreen);
  const panelFullscreen = useWorkspaceStore((s) => s.panelFullscreen);
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<{
    getModel: () => { getPositionAt: (offset: number) => { lineNumber: number; column: number } } | null;
    setSelection: (selection: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    }) => void;
    revealLineInCenter: (lineNumber: number) => void;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [focused, setFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchRegex, setSearchRegex] = useState(false);
  const [searchCase, setSearchCase] = useState(false);
  const [searchWholeWord, setSearchWholeWord] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(-1);

  const showPlaceholder = !value.trim() && !focused;
  const placeholder = getInputPlaceholder(toolId);
  const canReplace = variant !== 'right';

  const searchResult = useMemo(
    () =>
      findMatches(value, searchQuery, {
        useRegex: searchRegex,
        matchCase: searchCase,
        wholeWord: searchWholeWord,
      }),
    [searchCase, searchQuery, searchRegex, searchWholeWord, value]
  );

  const handleChange = (val: string | undefined) => {
    const v = val ?? '';
    setValue(toolId, v);
    onChange?.(v);
  };

  const applySelection = useCallback(
    (index: number) => {
      const editor = editorRef.current;
      if (!editor) return;
      const model = editor.getModel();
      if (!model) return;

      const match = searchResult.matches[index];
      if (!match) return;

      const start = model.getPositionAt(match.start);
      const end = model.getPositionAt(match.end);
      try {
        editor.setSelection({
          startLineNumber: Math.max(1, start.lineNumber),
          startColumn: Math.max(1, start.column),
          endLineNumber: Math.max(1, end.lineNumber),
          endColumn: Math.max(1, end.column),
        });
        editor.revealLineInCenter(Math.max(1, start.lineNumber));
      } catch {
        // Avoid surfacing Monaco cursor errors while user edits rapidly.
      }
    },
    [searchResult.matches]
  );

  const goNext = useCallback(() => {
    if (searchResult.matches.length === 0) return;
    const next = activeMatchIndex >= searchResult.matches.length - 1 ? 0 : activeMatchIndex + 1;
    setActiveMatchIndex(next);
    applySelection(next);
  }, [activeMatchIndex, applySelection, searchResult.matches.length]);

  const goPrev = useCallback(() => {
    if (searchResult.matches.length === 0) return;
    const next = activeMatchIndex <= 0 ? searchResult.matches.length - 1 : activeMatchIndex - 1;
    setActiveMatchIndex(next);
    applySelection(next);
  }, [activeMatchIndex, applySelection, searchResult.matches.length]);

  const focusSearchInput = useCallback(() => {
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  }, []);

  const replaceCurrent = useCallback(() => {
    if (!canReplace || searchResult.matches.length === 0 || activeMatchIndex < 0) return;

    const match = searchResult.matches[activeMatchIndex];
    if (!match) return;

    let replacement = replaceText;
    if (searchRegex) {
      try {
        const localRegex = buildSearchRegex(
          searchQuery,
          { useRegex: true, matchCase: searchCase, wholeWord: searchWholeWord },
          false
        );
        replacement = value.slice(match.start, match.end).replace(localRegex, replaceText);
      } catch {
        return;
      }
    }

    const nextValue = value.slice(0, match.start) + replacement + value.slice(match.end);
    setValue(toolId, nextValue);
    onChange?.(nextValue);
  }, [
    activeMatchIndex,
    canReplace,
    onChange,
    replaceText,
    searchCase,
    searchQuery,
    searchRegex,
    searchResult.matches,
    searchWholeWord,
    setValue,
    toolId,
    value,
  ]);

  const replaceAll = useCallback(() => {
    if (!canReplace || !searchQuery) return;
    try {
      const regex = buildSearchRegex(
        searchQuery,
        { useRegex: searchRegex, matchCase: searchCase, wholeWord: searchWholeWord },
        true
      );
      const nextValue = value.replace(regex, replaceText);
      setValue(toolId, nextValue);
      onChange?.(nextValue);
    } catch {
      // invalid regex error is shown in search panel.
    }
  }, [canReplace, onChange, replaceText, searchCase, searchQuery, searchRegex, searchWholeWord, setValue, toolId, value]);

  useEffect(() => {
    if (searchOpen) {
      focusSearchInput();
    }
  }, [focusSearchInput, searchOpen]);

  useEffect(() => {
    if (searchResult.matches.length === 0) {
      setActiveMatchIndex(-1);
      return;
    }
    if (activeMatchIndex >= searchResult.matches.length) {
      setActiveMatchIndex(-1);
    }
  }, [activeMatchIndex, searchResult.matches.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const withinPanel = !!(target && rootRef.current?.contains(target));
      const typingTarget =
        !!target &&
        (target.closest('input, textarea, select, [contenteditable=\"true\"], .monaco-editor, .cm-editor') !== null ||
          target.isContentEditable);

      if (mod && event.key.toLowerCase() === 'f' && (focused || withinPanel)) {
        event.preventDefault();
        event.stopPropagation();
        setSearchOpen(true);
        focusSearchInput();
        return;
      }
      if (searchOpen && event.key === 'Escape') {
        event.preventDefault();
        setSearchOpen(false);
        return;
      }
      if (typingTarget) {
        return;
      }
      if (searchOpen && event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) goPrev();
        else goNext();
        return;
      }
      if (event.key === 'F3' && (focused || searchOpen)) {
        event.preventDefault();
        if (event.shiftKey) goPrev();
        else goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [focusSearchInput, focused, goNext, goPrev, searchOpen]);

  return (
    <div ref={rootRef} className="flex flex-col h-full rounded-dt-lg overflow-hidden bg-dt-card/92 backdrop-blur-dt border border-dt-border shadow-dt-panel transition-all duration-200 hover:shadow-dt-soft focus-within:shadow-dt-soft">
      <div className="relative z-20 flex items-center justify-end gap-2 px-3 py-2.5 bg-dt-surface border-b border-dt-border shrink-0 sticky top-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSearchOpen((v) => !v);
          }}
          className={`text-sm text-dt-text-muted hover:text-dt-text px-3 py-1.5 rounded-xl border border-dt-border hover:bg-dt-soft bg-dt-card transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${searchOpen ? 'bg-dt-soft text-dt-text' : ''}`}
          title="Search"
        >
          Search
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPanelFullscreen(panelFullscreen === 'input' ? 'none' : 'input'); }}
          className="text-sm text-dt-text-muted hover:text-dt-text px-3 py-1.5 rounded-xl border border-dt-border hover:bg-dt-soft bg-dt-card transition-all duration-200 cursor-pointer"
          title={panelFullscreen === 'input' ? 'Exit fullscreen' : 'Fullscreen input panel'}
        >
          {panelFullscreen === 'input' ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      {searchOpen && (
        <div className="border-b border-dt-border bg-dt-surface/95 px-3 py-2.5 backdrop-blur-dt-sm">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className={`grid gap-2 ${canReplace ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveMatchIndex(-1);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) goPrev();
                    else goNext();
                  }
                }}
                onKeyUp={(e) => e.stopPropagation()}
                placeholder="Find"
                className="h-8 w-full rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted"
              />
              {canReplace ? (
                <input
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  placeholder="Replace"
                  className="h-8 w-full rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted"
                />
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={searchResult.matches.length === 0}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={searchResult.matches.length === 0}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
              >
                Next
              </button>
              {canReplace ? (
                <>
                  <button
                    type="button"
                    onClick={replaceCurrent}
                    disabled={searchResult.matches.length === 0}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={replaceAll}
                    disabled={searchResult.matches.length === 0}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
                  >
                    Replace All
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-dt-text-muted">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-dt-border bg-dt-card text-dt-text focus:ring-0"
                checked={searchRegex}
                onChange={(e) => {
                  setSearchRegex(e.target.checked);
                  setActiveMatchIndex(-1);
                }}
              />
              Regex
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-dt-border bg-dt-card text-dt-text focus:ring-0"
                checked={searchCase}
                onChange={(e) => {
                  setSearchCase(e.target.checked);
                  setActiveMatchIndex(-1);
                }}
              />
              Match case
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-dt-border bg-dt-card text-dt-text focus:ring-0"
                checked={searchWholeWord}
                onChange={(e) => {
                  setSearchWholeWord(e.target.checked);
                  setActiveMatchIndex(-1);
                }}
              />
              Whole word
            </label>
            <span className="ml-auto tabular-nums text-dt-text-dim">
              {searchResult.matches.length === 0
                ? '0 matches'
                : `${activeMatchIndex >= 0 ? activeMatchIndex + 1 : 0} / ${searchResult.matches.length}`}
            </span>
          </div>
          {searchResult.error && <div className="mt-2 text-xs text-dt-error">{searchResult.error}</div>}
        </div>
      )}

      <div className="flex-1 min-h-0 relative z-0">
        <div
          className={`absolute inset-0 flex items-center justify-center px-8 text-center pointer-events-none z-10 text-sm text-dt-text-muted leading-relaxed transition-opacity duration-200 ${showPlaceholder ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <PlaceholderText text={placeholder} />
        </div>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          beforeMount={defineWorkspaceMonacoThemes}
          onMount={(editor) => {
            editorRef.current = {
              getModel: () => editor.getModel(),
              setSelection: (selection) => editor.setSelection(selection),
              revealLineInCenter: (lineNumber) => editor.revealLineInCenter(lineNumber),
            };
            editor.onDidFocusEditorText(() => setFocused(true));
            editor.onDidBlurEditorText(() => setFocused(false));
          }}
          theme={getMonacoTheme(theme)}
          options={{
            fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
            fontSize: 13,
            minimap: { enabled: false },
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 14, bottom: 16 },
            lineNumbersMinChars: 3,
            renderLineHighlight: 'gutter',
          }}
        />
      </div>
    </div>
  );
}
