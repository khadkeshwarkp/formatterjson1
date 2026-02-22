'use client';

import { useRef, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { getInputPlaceholder } from '@/lib/input-placeholders';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoWrapperProps {
  toolId: string;
  language?: string;
  onChange?: (value: string) => void;
  /** For dual-input tools (e.g. json-diff): bind to second input */
  variant?: 'left' | 'right';
}

function PlaceholderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-dt-accent">
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
  const editorRef = useRef<unknown>(null);
  const [focused, setFocused] = useState(false);

  const showPlaceholder = !value.trim() && !focused;
  const placeholder = getInputPlaceholder(toolId);

  const handleChange = (val: string | undefined) => {
    const v = val ?? '';
    setValue(toolId, v);
    onChange?.(v);
  };

  const handleSearch = useCallback(() => {
    const ed = editorRef.current as { focus(): void; getAction(id: string): { run(): void } | null; trigger?(source: string, handlerId: string, payload: unknown): void } | null;
    if (!ed) return;
    ed.focus();
    requestAnimationFrame(() => {
      if (ed.trigger) {
        ed.trigger('keyboard', 'editor.action.startFindReplaceAction', null);
      } else {
        ed.getAction('editor.action.startFindReplaceAction')?.run();
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative z-20 flex items-center justify-end gap-2 px-2 py-1 bg-dt-surface border-b border-dt-border shrink-0 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSearch(); }}
          className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent hover:bg-dt-bg transition-colors flex items-center gap-1 cursor-pointer"
          title="Search (Ctrl+F)"
        >
          🔍 Search
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPanelFullscreen(panelFullscreen === 'input' ? 'none' : 'input'); }}
          className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent hover:bg-dt-bg transition-colors cursor-pointer"
          title={panelFullscreen === 'input' ? 'Exit fullscreen' : 'Fullscreen input panel'}
        >
          {panelFullscreen === 'input' ? '⊟ Exit fullscreen' : '⊞ Fullscreen'}
        </button>
      </div>
      <div className="flex-1 min-h-0 relative z-0">
        {showPlaceholder && (
          <div
            className="absolute inset-0 flex items-start pt-3 px-4 pointer-events-none z-10 text-sm text-dt-text-muted leading-relaxed"
            aria-hidden
          >
            <PlaceholderText text={placeholder} />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          onMount={(editor) => {
            editorRef.current = editor;
            editor.onDidFocusEditorText(() => setFocused(true));
            editor.onDidBlurEditorText(() => setFocused(false));
          }}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
            fontSize: 16,
            minimap: { enabled: false },
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 8 },
            lineNumbersMinChars: 3,
            renderLineHighlight: 'gutter',
          }}
        />
      </div>
    </div>
  );
}
