'use client';

import { useRef, useCallback, useState } from 'react';
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
    const ed = editorRef.current as {
      focus(): void;
      getAction(id: string): { run(): void } | null;
      trigger?(source: string, handlerId: string, payload: unknown): void;
    } | null;
    if (!ed) return;
    ed.focus();
    requestAnimationFrame(() => {
      const actionIds = [
        'actions.find',
        'editor.action.startFindAction',
        'editor.action.startFindReplaceAction',
      ];
      let opened = false;
      for (const id of actionIds) {
        const action = ed.getAction(id);
        if (action) {
          action.run();
          opened = true;
          break;
        }
      }
      if (!opened && ed.trigger) {
        ed.trigger('keyboard', 'actions.find', null);
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-full rounded-dt-lg overflow-hidden bg-dt-card/92 backdrop-blur-dt border border-dt-border shadow-dt-panel transition-all duration-200 hover:shadow-dt-soft focus-within:shadow-dt-soft">
      <div className="relative z-20 flex items-center justify-end gap-2 px-3 py-2.5 bg-dt-surface border-b border-dt-border shrink-0 sticky top-0">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSearch(); }}
          className="text-sm text-dt-text-muted hover:text-dt-text px-3 py-1.5 rounded-xl border border-dt-border hover:bg-dt-soft bg-dt-card transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          title="Search (Ctrl+F)"
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
            editorRef.current = editor;
            editor.onDidFocusEditorText(() => setFocused(true));
            editor.onDidBlurEditorText(() => setFocused(false));
          }}
          theme={getMonacoTheme(theme)}
          options={{
            fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
            fontSize: 15,
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
