'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { getJsonDiffStructured, type DiffResult } from '@/lib/processors';
import { defineWorkspaceMonacoThemes, getMonacoDiffTheme } from '@/lib/monaco-theme';
import { applyTransform } from '@/lib/editor-transforms';
import UnifiedCompareBridge from './UnifiedCompareBridge';

type DiffCategory = 'addition' | 'deletion' | 'modification' | 'typeMismatch';

interface DiffItem {
  id: string;
  path: string;
  category: DiffCategory;
  label: string;
  lineLeft: number;
  lineRight: number;
}

interface JsonDiffViewProps {
  toolId: string;
}

const DiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  { ssr: false }
);

const SAMPLE_ORIGINAL = `{
  "user": {
    "profile": {
      "name": "Ava",
      "age": 30,
      "active": true
    },
    "email": "ava@company.com",
    "roles": ["admin"]
  }
}`;

const SAMPLE_MODIFIED = `{
  "user": {
    "profile": {
      "name": "Ava M.",
      "age": "31",
      "active": true,
      "timezone": "UTC"
    },
    "roles": ["admin", "editor"]
  }
}`;

interface TextMatch {
  line: number;
  column: number;
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

function lineColumnFromOffset(text: string, offset: number): { line: number; column: number } {
  const safe = Math.max(0, Math.min(offset, text.length));
  const fragment = text.slice(0, safe);
  const lines = fragment.split('\n');
  const line = Math.max(1, lines.length);
  const column = Math.max(1, (lines[lines.length - 1]?.length ?? 0) + 1);
  return { line, column };
}

function collectMatches(
  text: string,
  query: string,
  options: { useRegex: boolean; matchCase: boolean; wholeWord: boolean }
): { matches: TextMatch[]; error: string | null } {
  if (!query) return { matches: [], error: null };

  try {
    const regex = buildSearchRegex(query, options, true);
    const matches: TextMatch[] = [];
    let current = regex.exec(text);

    while (current) {
      const offset = current.index;
      const pos = lineColumnFromOffset(text, offset);
      matches.push({ line: pos.line, column: pos.column });
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

function findLineForPath(text: string, path: string): number {
  if (!text.trim()) return 1;
  if (path === 'root') return 1;
  const segments = path.split('.').filter(Boolean);
  const key = [...segments].reverse().find((s) => Number.isNaN(Number(s))) ?? segments[segments.length - 1];
  const lines = text.split('\n');
  const needle = `"${key}"`;
  const idx = lines.findIndex((line) => line.includes(needle));
  return idx >= 0 ? idx + 1 : 1;
}

function useDiffItems(diff: DiffResult | null, left: string, right: string): DiffItem[] {
  return useMemo(() => {
    if (!diff) return [];
    const additions = diff.added.map((x, i) => ({
      id: `a-${i}-${x.path}`,
      path: x.path,
      category: 'addition' as const,
      label: `${x.path} (added)`,
      lineLeft: findLineForPath(left, x.path),
      lineRight: findLineForPath(right, x.path),
    }));
    const deletions = diff.removed.map((x, i) => ({
      id: `d-${i}-${x.path}`,
      path: x.path,
      category: 'deletion' as const,
      label: `${x.path} (removed)`,
      lineLeft: findLineForPath(left, x.path),
      lineRight: findLineForPath(right, x.path),
    }));
    const modifications = diff.changed.map((x, i) => ({
      id: `m-${i}-${x.path}`,
      path: x.path,
      category: 'modification' as const,
      label: `${x.path} (modified)`,
      lineLeft: findLineForPath(left, x.path),
      lineRight: findLineForPath(right, x.path),
    }));
    const mismatches = diff.typeMismatches.map((x, i) => ({
      id: `t-${i}-${x.path}`,
      path: x.path,
      category: 'typeMismatch' as const,
      label: `${x.path} (type mismatch: ${x.leftType} → ${x.rightType})`,
      lineLeft: findLineForPath(left, x.path),
      lineRight: findLineForPath(right, x.path),
    }));
    return [...additions, ...deletions, ...modifications, ...mismatches];
  }, [diff, left, right]);
}

export default function JsonDiffView({ toolId }: JsonDiffViewProps) {
  const theme = useWorkspaceStore((s) => s.theme);
  const input = useWorkspaceStore((s) => s.toolData[toolId]?.input ?? '');
  const input2 = useWorkspaceStore((s) => s.toolData[toolId]?.input2 ?? '');
  const setInput = useWorkspaceStore((s) => s.setInput);
  const setInput2 = useWorkspaceStore((s) => s.setInput2);

  const [showAdditions, setShowAdditions] = useState(true);
  const [showDeletions, setShowDeletions] = useState(true);
  const [showModifications, setShowModifications] = useState(true);
  const [showTypeMismatches, setShowTypeMismatches] = useState(true);
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [leftSearchQuery, setLeftSearchQuery] = useState('');
  const [rightSearchQuery, setRightSearchQuery] = useState('');
  const [searchRegex, setSearchRegex] = useState(false);
  const [searchCase, setSearchCase] = useState(false);
  const [searchWholeWord, setSearchWholeWord] = useState(false);
  const [activeSearchPane, setActiveSearchPane] = useState<'left' | 'right'>('left');
  const [leftActiveSearchIndex, setLeftActiveSearchIndex] = useState(-1);
  const [rightActiveSearchIndex, setRightActiveSearchIndex] = useState(-1);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [leftFocused, setLeftFocused] = useState(false);
  const [rightFocused, setRightFocused] = useState(false);
  const leftSearchInputRef = useRef<HTMLInputElement>(null);
  const rightSearchInputRef = useRef<HTMLInputElement>(null);
  const lastToolIdRef = useRef(toolId);
  const originalSeedRef = useRef(input);
  const modifiedSeedRef = useRef(input2);

  if (lastToolIdRef.current !== toolId) {
    lastToolIdRef.current = toolId;
    originalSeedRef.current = input;
    modifiedSeedRef.current = input2;
  }

  const diffEditorRef = useRef<{
    getLineChanges: () => unknown[];
    getModifiedEditor: () => {
      getValue?: () => string;
      setValue?: (value: string) => void;
      revealLine: (line: number) => void;
      getPosition?: () => { lineNumber: number; column: number } | null;
      setPosition?: (position: { lineNumber: number; column: number }) => void;
      createDecorationsCollection?: (decorations: unknown[]) => { clear: () => void; set: (decorations: unknown[]) => void };
      onDidFocusEditorText?: (cb: () => void) => void;
      onDidBlurEditorText?: (cb: () => void) => void;
    };
    getOriginalEditor: () => {
      getValue?: () => string;
      setValue?: (value: string) => void;
      revealLine: (line: number) => void;
      getPosition?: () => { lineNumber: number; column: number } | null;
      setPosition?: (position: { lineNumber: number; column: number }) => void;
      createDecorationsCollection?: (decorations: unknown[]) => { clear: () => void; set: (decorations: unknown[]) => void };
      onDidFocusEditorText?: (cb: () => void) => void;
      onDidBlurEditorText?: (cb: () => void) => void;
    };
  } | null>(null);

  const originalDecorationsRef = useRef<{ clear: () => void; set: (decorations: unknown[]) => void } | null>(null);
  const modifiedDecorationsRef = useRef<{ clear: () => void; set: (decorations: unknown[]) => void } | null>(null);

  const diffStructured = useMemo(() => getJsonDiffStructured(input, input2), [input, input2]);
  const isStructured = diffStructured && !('error' in diffStructured);
  const diff = isStructured ? (diffStructured as DiffResult) : null;
  const parseError = !isStructured ? (diffStructured as { error: string }).error : null;

  const addedCount = diff?.added.length ?? 0;
  const removedCount = diff?.removed.length ?? 0;
  const modifiedCount = diff?.changed.length ?? 0;
  const typeMismatchCount = diff?.typeMismatches.length ?? 0;
  const totalChanges = addedCount + removedCount + modifiedCount + typeMismatchCount;

  const diffItems = useDiffItems(diff, input, input2);

  const filteredItems = useMemo(
    () =>
      diffItems.filter((item) => {
        if (item.category === 'addition' && !showAdditions) return false;
        if (item.category === 'deletion' && !showDeletions) return false;
        if (item.category === 'modification' && !showModifications) return false;
        if (item.category === 'typeMismatch' && !showTypeMismatches) return false;
        return true;
      }),
    [diffItems, showAdditions, showDeletions, showModifications, showTypeMismatches]
  );

  const leftSearchResult = useMemo(
    () =>
      collectMatches(input, leftSearchQuery, {
        useRegex: searchRegex,
        matchCase: searchCase,
        wholeWord: searchWholeWord,
      }),
    [input, leftSearchQuery, searchCase, searchRegex, searchWholeWord]
  );

  const rightSearchResult = useMemo(
    () =>
      collectMatches(input2, rightSearchQuery, {
        useRegex: searchRegex,
        matchCase: searchCase,
        wholeWord: searchWholeWord,
      }),
    [input2, rightSearchQuery, searchCase, searchRegex, searchWholeWord]
  );

  const summaryText = `${totalChanges} changes • ${addedCount} addition${addedCount !== 1 ? 's' : ''} • ${modifiedCount} modification${modifiedCount !== 1 ? 's' : ''} • ${typeMismatchCount} type mismatch${typeMismatchCount !== 1 ? 'es' : ''}`;

  const jumpToItem = useCallback((item: DiffItem) => {
    const editor = diffEditorRef.current;
    if (!editor) return;
    const leftLine = Math.max(1, item.lineLeft);
    const rightLine = Math.max(1, item.lineRight);
    editor.getOriginalEditor().revealLine(leftLine);
    editor.getModifiedEditor().revealLine(rightLine);
    editor.getOriginalEditor().setPosition?.({ lineNumber: leftLine, column: 1 });
    editor.getModifiedEditor().setPosition?.({ lineNumber: rightLine, column: 1 });
  }, []);

  const goToPrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    const nextIndex = activeIndex <= 0 ? filteredItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
    jumpToItem(filteredItems[nextIndex]);
  }, [activeIndex, filteredItems, jumpToItem]);

  const goToNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    const nextIndex = activeIndex >= filteredItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
    jumpToItem(filteredItems[nextIndex]);
  }, [activeIndex, filteredItems, jumpToItem]);

  const jumpToSearchMatch = useCallback((side: 'left' | 'right', match: TextMatch) => {
    const editor = diffEditorRef.current;
    if (!editor) return;

    const safeLine = Math.max(1, match.line);
    const safeColumn = Math.max(1, match.column);

    try {
      if (side === 'left') {
        editor.getOriginalEditor().revealLine(safeLine);
        editor.getOriginalEditor().setPosition?.({ lineNumber: safeLine, column: safeColumn });
      } else {
        editor.getModifiedEditor().revealLine(safeLine);
        editor.getModifiedEditor().setPosition?.({ lineNumber: safeLine, column: safeColumn });
      }
    } catch {
      // Swallow transient Monaco line/cursor exceptions while models refresh.
    }
  }, []);

  const goToPrevLeftSearch = useCallback(() => {
    if (leftSearchResult.matches.length === 0) return;
    const next =
      leftActiveSearchIndex <= 0
        ? leftSearchResult.matches.length - 1
        : leftActiveSearchIndex - 1;
    setLeftActiveSearchIndex(next);
    setActiveSearchPane('left');
    jumpToSearchMatch('left', leftSearchResult.matches[next]);
  }, [jumpToSearchMatch, leftActiveSearchIndex, leftSearchResult.matches]);

  const goToNextLeftSearch = useCallback(() => {
    if (leftSearchResult.matches.length === 0) return;
    const next =
      leftActiveSearchIndex >= leftSearchResult.matches.length - 1
        ? 0
        : leftActiveSearchIndex + 1;
    setLeftActiveSearchIndex(next);
    setActiveSearchPane('left');
    jumpToSearchMatch('left', leftSearchResult.matches[next]);
  }, [jumpToSearchMatch, leftActiveSearchIndex, leftSearchResult.matches]);

  const goToPrevRightSearch = useCallback(() => {
    if (rightSearchResult.matches.length === 0) return;
    const next =
      rightActiveSearchIndex <= 0
        ? rightSearchResult.matches.length - 1
        : rightActiveSearchIndex - 1;
    setRightActiveSearchIndex(next);
    setActiveSearchPane('right');
    jumpToSearchMatch('right', rightSearchResult.matches[next]);
  }, [jumpToSearchMatch, rightActiveSearchIndex, rightSearchResult.matches]);

  const goToNextRightSearch = useCallback(() => {
    if (rightSearchResult.matches.length === 0) return;
    const next =
      rightActiveSearchIndex >= rightSearchResult.matches.length - 1
        ? 0
        : rightActiveSearchIndex + 1;
    setRightActiveSearchIndex(next);
    setActiveSearchPane('right');
    jumpToSearchMatch('right', rightSearchResult.matches[next]);
  }, [jumpToSearchMatch, rightActiveSearchIndex, rightSearchResult.matches]);

  const focusSearchInput = useCallback((side?: 'left' | 'right') => {
    const targetSide = side ?? (rightFocused && !leftFocused ? 'right' : 'left');
    setActiveSearchPane(targetSide);
    requestAnimationFrame(() => {
      const targetRef = targetSide === 'left' ? leftSearchInputRef : rightSearchInputRef;
      targetRef.current?.focus();
      targetRef.current?.select();
    });
  }, [leftFocused, rightFocused]);

  const loadExample = useCallback(() => {
    setInput(toolId, SAMPLE_ORIGINAL);
    setInput2(toolId, SAMPLE_MODIFIED);
  }, [setInput, setInput2, toolId]);

  const copyLeftToRight = useCallback(() => {
    setInput2(toolId, input);
  }, [input, setInput2, toolId]);

  const copyRightToLeft = useCallback(() => {
    setInput(toolId, input2);
  }, [input2, setInput, toolId]);

  const transformSide = useCallback(
    (side: 'left' | 'right') => {
      const current = side === 'left' ? input : input2;
      const result = applyTransform(current, 'format');
      if (result.error) return;

      if (side === 'left') {
        setInput(toolId, result.output);
      } else {
        setInput2(toolId, result.output);
      }
    },
    [input, input2, setInput, setInput2, toolId]
  );

  const toggleCountCategory = useCallback((category: DiffCategory) => {
    if (category === 'addition') setShowAdditions((v) => !v);
    if (category === 'deletion') setShowDeletions((v) => !v);
    if (category === 'modification') setShowModifications((v) => !v);
    if (category === 'typeMismatch') setShowTypeMismatches((v) => !v);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1180px)');
    const apply = () => setIsNarrow(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (isNarrow) {
      setDrawerOpen(false);
      setBridgeOpen(false);
    }
  }, [isNarrow]);

  useEffect(() => {
    if (activeIndex >= filteredItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredItems.length]);

  useEffect(() => {
    if (searchOpen) {
      focusSearchInput();
    }
  }, [focusSearchInput, searchOpen]);

  useEffect(() => {
    if (leftSearchResult.matches.length === 0) {
      setLeftActiveSearchIndex(-1);
      return;
    }
    if (leftActiveSearchIndex >= leftSearchResult.matches.length) {
      setLeftActiveSearchIndex(-1);
    }
  }, [leftActiveSearchIndex, leftSearchResult.matches.length]);

  useEffect(() => {
    if (rightSearchResult.matches.length === 0) {
      setRightActiveSearchIndex(-1);
      return;
    }
    if (rightActiveSearchIndex >= rightSearchResult.matches.length) {
      setRightActiveSearchIndex(-1);
    }
  }, [rightActiveSearchIndex, rightSearchResult.matches.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const typingTarget =
        !!target &&
        (target.closest('input, textarea, select') !== null || target.isContentEditable);

      if (mod && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        e.stopPropagation();
        setSearchOpen(true);
        focusSearchInput();
        return;
      }
      if (searchOpen && e.key === 'Escape') {
        e.preventDefault();
        setSearchOpen(false);
        return;
      }
      if (typingTarget) {
        return;
      }
      if (searchOpen && e.key === 'Enter') {
        e.preventDefault();
        if (activeSearchPane === 'right') {
          if (e.shiftKey) goToPrevRightSearch();
          else goToNextRightSearch();
        } else {
          if (e.shiftKey) goToPrevLeftSearch();
          else goToNextLeftSearch();
        }
        return;
      }
      if (e.key === 'F7' || (e.altKey && e.key === 'ArrowDown')) {
        e.preventDefault();
        goToNext();
      }
      if ((e.shiftKey && e.key === 'F7') || (e.altKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === 'F3') {
        e.preventDefault();
        if (activeSearchPane === 'right') {
          if (e.shiftKey) goToPrevRightSearch();
          else goToNextRightSearch();
        } else {
          if (e.shiftKey) goToPrevLeftSearch();
          else goToNextLeftSearch();
        }
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [
    activeSearchPane,
    focusSearchInput,
    goToNext,
    goToNextLeftSearch,
    goToNextRightSearch,
    goToPrev,
    goToPrevLeftSearch,
    goToPrevRightSearch,
    searchOpen,
  ]);

  const applyDecorations = useCallback(() => {
    if (!diffEditorRef.current || !originalDecorationsRef.current || !modifiedDecorationsRef.current) return;

    const modifiedItems = filteredItems.filter((item) => item.category === 'modification');
    const mismatchItems = filteredItems.filter((item) => item.category === 'typeMismatch');

    const originalDecorations = [
      ...modifiedItems.map((item) => ({
        range: { startLineNumber: item.lineLeft, startColumn: 1, endLineNumber: item.lineLeft, endColumn: 1 },
        options: { isWholeLine: true, className: 'dt-diff-line-modified' },
      })),
      ...mismatchItems.map((item) => ({
        range: { startLineNumber: item.lineLeft, startColumn: 1, endLineNumber: item.lineLeft, endColumn: 1 },
        options: { isWholeLine: true, className: 'dt-diff-line-mismatch' },
      })),
    ];

    const modifiedDecorations = [
      ...modifiedItems.map((item) => ({
        range: { startLineNumber: item.lineRight, startColumn: 1, endLineNumber: item.lineRight, endColumn: 1 },
        options: { isWholeLine: true, className: 'dt-diff-line-modified' },
      })),
      ...mismatchItems.map((item) => ({
        range: { startLineNumber: item.lineRight, startColumn: 1, endLineNumber: item.lineRight, endColumn: 1 },
        options: { isWholeLine: true, className: 'dt-diff-line-mismatch' },
      })),
    ];

    originalDecorationsRef.current.set(originalDecorations);
    modifiedDecorationsRef.current.set(modifiedDecorations);
  }, [filteredItems]);

  const onMount = useCallback(
    (editor: unknown) => {
      const ed = editor as {
        getLineChanges: () => unknown[];
        getModifiedEditor: () => {
          getValue: () => string;
          onDidChangeModelContent: (fn: () => void) => { dispose: () => void };
          revealLine: (l: number) => void;
          setPosition?: (position: { lineNumber: number; column: number }) => void;
          createDecorationsCollection?: (decorations: unknown[]) => { clear: () => void; set: (decorations: unknown[]) => void };
          onDidFocusEditorText?: (cb: () => void) => void;
          onDidBlurEditorText?: (cb: () => void) => void;
        };
        getOriginalEditor: () => {
          getValue: () => string;
          onDidChangeModelContent: (fn: () => void) => { dispose: () => void };
          revealLine: (l: number) => void;
          setPosition?: (position: { lineNumber: number; column: number }) => void;
          createDecorationsCollection?: (decorations: unknown[]) => { clear: () => void; set: (decorations: unknown[]) => void };
          onDidFocusEditorText?: (cb: () => void) => void;
          onDidBlurEditorText?: (cb: () => void) => void;
        };
      };

      diffEditorRef.current = ed;

      originalDecorationsRef.current = ed.getOriginalEditor().createDecorationsCollection?.([]) ?? null;
      modifiedDecorationsRef.current = ed.getModifiedEditor().createDecorationsCollection?.([]) ?? null;

      ed.getOriginalEditor().onDidFocusEditorText?.(() => setLeftFocused(true));
      ed.getOriginalEditor().onDidBlurEditorText?.(() => setLeftFocused(false));
      ed.getModifiedEditor().onDidFocusEditorText?.(() => setRightFocused(true));
      ed.getModifiedEditor().onDidBlurEditorText?.(() => setRightFocused(false));

      ed.getOriginalEditor().onDidChangeModelContent(() => {
        const next = ed.getOriginalEditor().getValue();
        setInput(toolId, next);
      });
      ed.getModifiedEditor().onDidChangeModelContent(() => {
        const next = ed.getModifiedEditor().getValue();
        setInput2(toolId, next);
      });
    },
    [setInput, setInput2, toolId]
  );

  useEffect(() => {
    applyDecorations();
  }, [applyDecorations]);

  useEffect(() => {
    const editor = diffEditorRef.current?.getOriginalEditor();
    if (!editor?.getValue || !editor.setValue) return;
    const current = editor.getValue();
    if (current === input) return;
    const position = editor.getPosition?.() ?? null;
    editor.setValue(input);
    if (position) {
      editor.setPosition?.(position);
    }
  }, [input]);

  useEffect(() => {
    const editor = diffEditorRef.current?.getModifiedEditor();
    if (!editor?.getValue || !editor.setValue) return;
    const current = editor.getValue();
    if (current === input2) return;
    const position = editor.getPosition?.() ?? null;
    editor.setValue(input2);
    if (position) {
      editor.setPosition?.(position);
    }
  }, [input2]);

  useEffect(() => {
    return () => {
      originalDecorationsRef.current?.clear();
      modifiedDecorationsRef.current?.clear();
    };
  }, []);

  const chipClass = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${active ? 'bg-dt-soft border-dt-border text-dt-text' : 'bg-dt-card border-dt-border text-dt-text hover:bg-dt-soft/70'}`;

  const categoryChipClass = (active: boolean, category: DiffCategory) => {
    const base = 'text-xs px-3 py-1.5 rounded-xl border transition-all duration-200';
    if (!active) return `${base} bg-dt-card border-dt-border text-dt-text hover:bg-dt-soft/70`;
    if (category === 'addition') return `${base} bg-[rgba(84,158,112,0.12)] border-[rgba(84,158,112,0.3)] text-dt-text`;
    if (category === 'deletion') return `${base} bg-[rgba(178,112,112,0.12)] border-[rgba(178,112,112,0.3)] text-dt-text`;
    if (category === 'modification') return `${base} bg-[rgba(158,132,85,0.13)] border-[rgba(158,132,85,0.32)] text-dt-text`;
    return `${base} bg-[rgba(127,92,166,0.14)] border-[rgba(127,92,166,0.32)] text-dt-text`;
  };

  const checkboxClass = 'h-4 w-4 rounded border-dt-border bg-dt-card text-dt-text focus:ring-0';

  return (
    <div className="flex flex-col h-full min-h-[70vh] rounded-dt-lg overflow-hidden bg-dt-card border border-dt-border shadow-dt-panel">
      <div className="sticky top-0 z-30 border-b border-dt-border bg-dt-surface/95 backdrop-blur-dt-sm">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="text-sm text-dt-text">{summaryText}</div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => toggleCountCategory('addition')} className={categoryChipClass(showAdditions, 'addition')}>{addedCount} additions</button>
            <button type="button" onClick={() => toggleCountCategory('deletion')} className={categoryChipClass(showDeletions, 'deletion')}>{removedCount} deletions</button>
            <button type="button" onClick={() => toggleCountCategory('modification')} className={categoryChipClass(showModifications, 'modification')}>{modifiedCount} modified</button>
            <button type="button" onClick={() => toggleCountCategory('typeMismatch')} className={categoryChipClass(showTypeMismatches, 'typeMismatch')}>{typeMismatchCount} type mismatch</button>
            <button type="button" onClick={loadExample} className={chipClass(false)}>Load Example</button>
          </div>
        </div>

        <div className="flex items-center gap-5 px-4 pb-2.5 text-xs text-dt-text">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className={checkboxClass} checked={showAdditions} onChange={(e) => setShowAdditions(e.target.checked)} />
            Show additions
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className={checkboxClass} checked={showDeletions} onChange={(e) => setShowDeletions(e.target.checked)} />
            Show deletions
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className={checkboxClass} checked={showModifications} onChange={(e) => setShowModifications(e.target.checked)} />
            Show modified values
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className={checkboxClass} checked={showTypeMismatches} onChange={(e) => setShowTypeMismatches(e.target.checked)} />
            Show type mismatches
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className={checkboxClass} checked={hideUnchanged} onChange={(e) => setHideUnchanged(e.target.checked)} />
            Hide unchanged sections
          </label>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={goToPrev} className={chipClass(false)} title="Previous difference (Shift+F7)">Prev</button>
            <span className="text-[11px] tabular-nums text-dt-text-dim">{filteredItems.length === 0 ? '0 of 0' : `${activeIndex + 1} of ${filteredItems.length}`}</span>
            <button type="button" onClick={goToNext} className={chipClass(false)} title="Next difference (F7)">Next</button>
            <button type="button" onClick={() => setSearchOpen((v) => !v)} className={chipClass(searchOpen)}>{searchOpen ? 'Hide Search' : 'Search'}</button>
            <button type="button" onClick={() => setBridgeOpen((v) => !v)} className={chipClass(false)}>{bridgeOpen ? 'Hide Bridge' : 'Show Bridge'}</button>
            <button type="button" onClick={() => setDrawerOpen((v) => !v)} className={chipClass(false)}>{drawerOpen ? 'Hide Paths' : 'Show Paths'}</button>
          </div>
        </div>

        {searchOpen && (
          <div className="px-4 pb-2.5">
            <div className="flex flex-wrap items-center gap-4 text-xs text-dt-text-muted">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={searchRegex}
                  onChange={(e) => {
                    setSearchRegex(e.target.checked);
                    setLeftActiveSearchIndex(-1);
                    setRightActiveSearchIndex(-1);
                  }}
                />
                Regex
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={searchCase}
                  onChange={(e) => {
                    setSearchCase(e.target.checked);
                    setLeftActiveSearchIndex(-1);
                    setRightActiveSearchIndex(-1);
                  }}
                />
                Match case
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={searchWholeWord}
                  onChange={(e) => {
                    setSearchWholeWord(e.target.checked);
                    setLeftActiveSearchIndex(-1);
                    setRightActiveSearchIndex(-1);
                  }}
                />
                Whole word
              </label>
            </div>
          </div>
        )}

        {parseError ? <div className="px-4 pb-2.5 text-xs text-dt-error">{parseError}</div> : null}
      </div>

      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0 min-h-0 flex flex-col border-r border-dt-border/70">
          <div className="border-b border-dt-border bg-dt-surface/80 sticky top-0 z-20">
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 text-xs font-medium text-dt-text-muted border-r border-dt-border">Original</div>
              <div className="px-4 py-2 text-xs font-medium text-dt-text-muted">Modified</div>
            </div>
            {searchOpen && (
              <div className="grid grid-cols-2 border-t border-dt-border">
                <div className="px-3 py-2.5 border-r border-dt-border">
                  <div className="flex items-center gap-2">
                    <input
                      ref={leftSearchInputRef}
                      value={leftSearchQuery}
                      onFocus={() => setActiveSearchPane('left')}
                      onChange={(e) => {
                        setLeftSearchQuery(e.target.value);
                        setLeftActiveSearchIndex(-1);
                        setActiveSearchPane('left');
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.shiftKey) goToPrevLeftSearch();
                          else goToNextLeftSearch();
                        }
                      }}
                      onKeyUp={(e) => e.stopPropagation()}
                      placeholder="Search original"
                      className="h-8 flex-1 min-w-0 rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted"
                    />
                    <button
                      type="button"
                      onClick={goToPrevLeftSearch}
                      disabled={leftSearchResult.matches.length === 0}
                      className={chipClass(false)}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={goToNextLeftSearch}
                      disabled={leftSearchResult.matches.length === 0}
                      className={chipClass(false)}
                    >
                      Next
                    </button>
                    <span className="text-[11px] tabular-nums text-dt-text-dim min-w-[64px] text-right">
                      {leftSearchResult.matches.length === 0
                        ? '0 / 0'
                        : `${leftActiveSearchIndex >= 0 ? leftActiveSearchIndex + 1 : 0} / ${leftSearchResult.matches.length}`}
                    </span>
                  </div>
                  {leftSearchResult.error ? <div className="mt-1.5 text-xs text-dt-error">{leftSearchResult.error}</div> : null}
                </div>
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      ref={rightSearchInputRef}
                      value={rightSearchQuery}
                      onFocus={() => setActiveSearchPane('right')}
                      onChange={(e) => {
                        setRightSearchQuery(e.target.value);
                        setRightActiveSearchIndex(-1);
                        setActiveSearchPane('right');
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.shiftKey) goToPrevRightSearch();
                          else goToNextRightSearch();
                        }
                      }}
                      onKeyUp={(e) => e.stopPropagation()}
                      placeholder="Search modified"
                      className="h-8 flex-1 min-w-0 rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted"
                    />
                    <button
                      type="button"
                      onClick={goToPrevRightSearch}
                      disabled={rightSearchResult.matches.length === 0}
                      className={chipClass(false)}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={goToNextRightSearch}
                      disabled={rightSearchResult.matches.length === 0}
                      className={chipClass(false)}
                    >
                      Next
                    </button>
                    <span className="text-[11px] tabular-nums text-dt-text-dim min-w-[64px] text-right">
                      {rightSearchResult.matches.length === 0
                        ? '0 / 0'
                        : `${rightActiveSearchIndex >= 0 ? rightActiveSearchIndex + 1 : 0} / ${rightSearchResult.matches.length}`}
                    </span>
                  </div>
                  {rightSearchResult.error ? <div className="mt-1.5 text-xs text-dt-error">{rightSearchResult.error}</div> : null}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-dt-border z-10 pointer-events-none" aria-hidden />
            <div className={`absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center z-10 pointer-events-none px-8 text-center text-sm text-dt-text-muted leading-relaxed transition-opacity duration-200 ${input.trim() || leftFocused ? 'opacity-0' : 'opacity-100'}`} aria-hidden>
              Paste original JSON here or drop a .json file
            </div>
            <div className={`absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center z-10 pointer-events-none px-8 text-center text-sm text-dt-text-muted leading-relaxed transition-opacity duration-200 ${input2.trim() || rightFocused ? 'opacity-0' : 'opacity-100'}`} aria-hidden>
              Paste modified JSON here to compare differences
            </div>

            <DiffEditor
              height="100%"
              original={originalSeedRef.current}
              modified={modifiedSeedRef.current}
              language="json"
              beforeMount={defineWorkspaceMonacoThemes}
              onMount={onMount}
              theme={getMonacoDiffTheme(theme)}
              options={{
                renderSideBySide: true,
                readOnly: false,
                originalEditable: true,
                enableSplitViewResizing: true,
                renderIndicators: true,
                ignoreTrimWhitespace: false,
                renderOverviewRuler: true,
                diffWordWrap: 'on',
                useInlineViewWhenSpaceIsLimited: false,
                fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
                fontSize: 13,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 16 },
                lineNumbersMinChars: 3,
                hideUnchangedRegions: {
                  enabled: hideUnchanged,
                  contextLineCount: 3,
                  minimumLineCount: 4,
                  revealLineCount: 8,
                },
              }}
            />
          </div>
        </div>

        {bridgeOpen && (
          <div className="border-l border-dt-border/70 bg-dt-surface/65 backdrop-blur-dt-sm">
            <UnifiedCompareBridge
              onCopyLeftToRight={copyLeftToRight}
              onCopyRightToLeft={copyRightToLeft}
              onTransformLeft={() => transformSide('left')}
              onTransformRight={() => transformSide('right')}
            />
          </div>
        )}

        {drawerOpen && (
          <aside className="w-[320px] min-w-[280px] max-w-[40%] border-l border-dt-border bg-dt-surface/70 backdrop-blur-dt-sm flex flex-col">
            <div className="px-3.5 py-2.5 border-b border-dt-border text-xs font-medium text-dt-text-muted sticky top-0 bg-dt-surface/90 z-10">
              Difference Paths ({filteredItems.length})
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {filteredItems.length === 0 ? (
                <div className="px-2 py-3 text-xs text-dt-text-dim">No differences for current filters.</div>
              ) : (
                filteredItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`w-full text-left px-2.5 py-2 rounded-xl border mb-1.5 transition-all duration-200 ${idx === activeIndex ? 'bg-dt-soft border-dt-border text-dt-text' : 'bg-dt-card border-dt-border/70 text-dt-text-muted hover:text-dt-text hover:bg-dt-soft/70'}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      jumpToItem(item);
                    }}
                  >
                    <div className="text-xs font-medium truncate">{item.path}</div>
                    <div className="text-[11px] text-dt-text-dim capitalize">{item.category === 'typeMismatch' ? 'type mismatch' : item.category}</div>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
