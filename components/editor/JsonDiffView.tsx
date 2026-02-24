'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { getJsonDiffStructured, type DiffResult } from '@/lib/processors';
import { defineWorkspaceMonacoThemes, getMonacoDiffTheme } from '@/lib/monaco-theme';

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

function tryFormatJson(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return text;
  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return null;
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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [leftFocused, setLeftFocused] = useState(false);
  const [rightFocused, setRightFocused] = useState(false);

  const diffEditorRef = useRef<{
    getLineChanges: () => unknown[];
    getModifiedEditor: () => {
      revealLine: (line: number) => void;
      setPosition?: (position: { lineNumber: number; column: number }) => void;
      createDecorationsCollection?: (decorations: unknown[]) => { clear: () => void; set: (decorations: unknown[]) => void };
      onDidFocusEditorText?: (cb: () => void) => void;
      onDidBlurEditorText?: (cb: () => void) => void;
    };
    getOriginalEditor: () => {
      revealLine: (line: number) => void;
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

  const summaryText = `${totalChanges} changes • ${addedCount} addition${addedCount !== 1 ? 's' : ''} • ${modifiedCount} modification${modifiedCount !== 1 ? 's' : ''} • ${typeMismatchCount} type mismatch${typeMismatchCount !== 1 ? 'es' : ''}`;

  const jumpToItem = useCallback((item: DiffItem) => {
    const editor = diffEditorRef.current;
    if (!editor) return;
    editor.getOriginalEditor().revealLine(item.lineLeft);
    editor.getModifiedEditor().revealLine(item.lineRight);
    editor.getOriginalEditor().setPosition?.({ lineNumber: item.lineLeft, column: 1 });
    editor.getModifiedEditor().setPosition?.({ lineNumber: item.lineRight, column: 1 });
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

  const loadExample = useCallback(() => {
    setInput(toolId, SAMPLE_ORIGINAL);
    setInput2(toolId, SAMPLE_MODIFIED);
  }, [setInput, setInput2, toolId]);

  const toggleCountCategory = useCallback((category: DiffCategory) => {
    if (category === 'addition') setShowAdditions((v) => !v);
    if (category === 'deletion') setShowDeletions((v) => !v);
    if (category === 'modification') setShowModifications((v) => !v);
    if (category === 'typeMismatch') setShowTypeMismatches((v) => !v);
  }, []);

  useEffect(() => {
    if (activeIndex >= filteredItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredItems.length]);

  useEffect(() => {
    if (leftFocused) return;
    const formatted = tryFormatJson(input);
    if (formatted !== null && formatted !== input) {
      setInput(toolId, formatted);
    }
  }, [input, leftFocused, setInput, toolId]);

  useEffect(() => {
    if (rightFocused) return;
    const formatted = tryFormatJson(input2);
    if (formatted !== null && formatted !== input2) {
      setInput2(toolId, formatted);
    }
  }, [input2, rightFocused, setInput2, toolId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F7' || (e.altKey && e.key === 'ArrowDown')) {
        e.preventDefault();
        goToNext();
      }
      if ((e.shiftKey && e.key === 'F7') || (e.altKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToNext, goToPrev]);

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
        setInput(toolId, ed.getOriginalEditor().getValue());
      });
      ed.getModifiedEditor().onDidChangeModelContent(() => {
        setInput2(toolId, ed.getModifiedEditor().getValue());
      });
    },
    [setInput, setInput2, toolId]
  );

  useEffect(() => {
    applyDecorations();
  }, [applyDecorations]);

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
            <button type="button" onClick={() => setDrawerOpen((v) => !v)} className={chipClass(false)}>{drawerOpen ? 'Hide Paths' : 'Show Paths'}</button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0 min-h-0 flex flex-col border-r border-dt-border/70">
          <div className="grid grid-cols-2 border-b border-dt-border bg-dt-surface/80 sticky top-0 z-20">
            <div className="px-4 py-2 text-xs font-medium text-dt-text-muted border-r border-dt-border">Original</div>
            <div className="px-4 py-2 text-xs font-medium text-dt-text-muted">Modified</div>
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
              original={input}
              modified={input2}
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
                fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
                fontSize: 14,
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
