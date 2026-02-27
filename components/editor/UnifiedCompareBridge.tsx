'use client';

import type { TransformAction } from '@/lib/editor-transforms';

interface UnifiedCompareBridgeProps {
  onCopyLeftToRight: () => void;
  onCopyRightToLeft: () => void;
  onTransformLeft?: (action: TransformAction) => void;
  onTransformRight?: (action: TransformAction) => void;
}

const buttonClass =
  'text-xs px-2.5 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200';

export default function UnifiedCompareBridge({
  onCopyLeftToRight,
  onCopyRightToLeft,
  onTransformLeft,
  onTransformRight,
}: UnifiedCompareBridgeProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-3">
      <button type="button" className={buttonClass} onClick={onCopyLeftToRight} title="Copy left to right">
        Left → Right
      </button>
      <button type="button" className={buttonClass} onClick={onCopyRightToLeft} title="Copy right to left">
        Right → Left
      </button>

      {onTransformLeft ? (
        <button
          type="button"
          className={buttonClass}
          onClick={() => onTransformLeft('format')}
          title="Format left"
        >
          Format Left
        </button>
      ) : null}

      {onTransformRight ? (
        <button
          type="button"
          className={buttonClass}
          onClick={() => onTransformRight('format')}
          title="Format right"
        >
          Format Right
        </button>
      ) : null}
    </div>
  );
}
