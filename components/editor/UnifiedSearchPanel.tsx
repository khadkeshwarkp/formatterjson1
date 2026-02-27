'use client';

import { useEffect, useRef } from 'react';
import type { ToolSearchState } from '@/lib/store';

interface UnifiedSearchPanelProps {
  open: boolean;
  focusSignal?: number;
  state: ToolSearchState;
  disabled?: boolean;
  error?: string | null;
  onChange: (next: Partial<ToolSearchState>) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
}

const checkboxClass =
  'h-4 w-4 rounded border-dt-border bg-dt-card text-dt-text focus:ring-0';

const inputClass =
  'h-8 w-full rounded-xl border border-dt-border bg-dt-card px-3 text-sm text-dt-text outline-none focus:border-dt-text-muted';

export default function UnifiedSearchPanel({
  open,
  focusSignal = 0,
  state,
  disabled = false,
  error,
  onChange,
  onClose,
  onNext,
  onPrev,
  onReplace,
  onReplaceAll,
}: UnifiedSearchPanelProps) {
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      findInputRef.current?.focus();
      findInputRef.current?.select();
    });
  }, [open, focusSignal]);

  if (!open) return null;

  const canNavigate = state.resultCount > 0 && !disabled;

  return (
    <div className="border-b border-dt-border bg-dt-surface/95 px-3 py-2.5 backdrop-blur-dt-sm">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            ref={findInputRef}
            value={state.query}
            onChange={(e) => onChange({ query: e.target.value, activeResultIndex: -1 })}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.shiftKey) onPrev();
                else onNext();
              }
            }}
            onKeyUp={(e) => e.stopPropagation()}
            placeholder="Find"
            className={inputClass}
            aria-label="Find"
          />
          <input
            value={state.replaceText}
            onChange={(e) => onChange({ replaceText: e.target.value })}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            placeholder="Replace"
            className={inputClass}
            aria-label="Replace"
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canNavigate}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNavigate}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
          >
            Next
          </button>
          <button
            type="button"
            onClick={onReplace}
            disabled={!canNavigate || disabled}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={onReplaceAll}
            disabled={!canNavigate || disabled}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 disabled:opacity-40"
          >
            Replace All
          </button>
          <button
            type="button"
            onClick={onClose}
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
            className={checkboxClass}
            checked={state.useRegex}
            onChange={(e) => onChange({ useRegex: e.target.checked, activeResultIndex: -1 })}
          />
          Regex
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={checkboxClass}
            checked={state.matchCase}
            onChange={(e) => onChange({ matchCase: e.target.checked, activeResultIndex: -1 })}
          />
          Match case
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={checkboxClass}
            checked={state.wholeWord}
            onChange={(e) => onChange({ wholeWord: e.target.checked, activeResultIndex: -1 })}
          />
          Whole word
        </label>

        <span className="ml-auto tabular-nums text-dt-text-dim">
          {state.resultCount === 0
            ? '0 matches'
            : `${state.activeResultIndex >= 0 ? state.activeResultIndex + 1 : 0} / ${state.resultCount}`}
        </span>
      </div>

      {disabled ? (
        <div className="mt-2 text-xs text-dt-text-dim">
          Search and replace is available in text mode. Switch mode to continue.
        </div>
      ) : null}
      {error ? <div className="mt-2 text-xs text-dt-error">{error}</div> : null}
    </div>
  );
}
