'use client';

import type { EditorMode } from '@/lib/store';
import type { TransformAction } from '@/lib/editor-transforms';

interface UnifiedEditorToolbarProps {
  label?: string;
  mode: EditorMode;
  allowedModes: EditorMode[];
  showModeSwitch?: boolean;
  showTransformActions?: boolean;
  showQueryAction?: boolean;
  readOnly?: boolean;
  searchOpen: boolean;
  queryOpen: boolean;
  onModeChange: (mode: EditorMode) => void;
  onToggleSearch: () => void;
  onToggleQuery: () => void;
  onTransform: (action: TransformAction) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const chipClass =
  'text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200';

const modeChipClass = (active: boolean) =>
  `text-xs px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${
    active
      ? 'bg-dt-soft border-dt-border text-dt-text'
      : 'bg-dt-card border-dt-border text-dt-text-muted hover:text-dt-text hover:bg-dt-soft'
  }`;

export default function UnifiedEditorToolbar({
  label,
  mode,
  allowedModes,
  showModeSwitch = true,
  showTransformActions = true,
  showQueryAction = true,
  readOnly = false,
  searchOpen,
  queryOpen,
  onModeChange,
  onToggleSearch,
  onToggleQuery,
  onTransform,
  onToggleFullscreen,
  isFullscreen,
}: UnifiedEditorToolbarProps) {
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2 px-3 py-2.5 bg-dt-surface border-b border-dt-border shrink-0 sticky top-0">
      {label ? <span className="text-xs font-medium text-dt-text-muted mr-1">{label}</span> : null}

      {showModeSwitch ? (
        <div className="flex items-center gap-1.5 mr-1">
          {allowedModes.map((candidateMode) => (
            <button
              key={candidateMode}
              type="button"
              onClick={() => onModeChange(candidateMode)}
              className={modeChipClass(mode === candidateMode)}
            >
              {candidateMode}
            </button>
          ))}
        </div>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSearch}
          className={`${chipClass} ${searchOpen ? 'bg-dt-soft text-dt-text' : ''}`}
          title="Search / Replace"
        >
          Search
        </button>

        {!readOnly && showTransformActions ? (
          <>
            <button type="button" onClick={() => onTransform('format')} className={chipClass}>
              Format
            </button>
            <button type="button" onClick={() => onTransform('minify')} className={chipClass}>
              Minify
            </button>
            <button type="button" onClick={() => onTransform('sortKeys')} className={chipClass}>
              Sort
            </button>
            <button type="button" onClick={() => onTransform('repair')} className={chipClass}>
              Repair
            </button>
          </>
        ) : null}

        {!readOnly && showQueryAction ? (
          <button
            type="button"
            onClick={onToggleQuery}
            className={`${chipClass} ${queryOpen ? 'bg-dt-soft text-dt-text' : ''}`}
          >
            Query
          </button>
        ) : null}

        <button type="button" onClick={onToggleFullscreen} className={chipClass}>
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
}
