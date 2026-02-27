'use client';

import { useRef } from 'react';
import LZString from 'lz-string';
import { useWorkspaceStore } from '@/lib/store';
import { TOOL_MAP } from '@/lib/tools-registry';
import { copyToClipboard } from '@/lib/utils';

interface ToolbarProps {
  toolId: string;
  onRun: () => void;
  processing: boolean;
  toolName: string;
  toolIcon: string;
  base64Mode?: 'encode' | 'decode';
  setBase64Mode?: (mode: 'encode' | 'decode') => void;
  isJsonTool?: boolean;
  showRun?: boolean;
  showSort?: boolean;
}

function sortJsonKeys(input: string): string | null {
  try {
    const obj = JSON.parse(input);
    const sortKeys = (o: unknown): unknown => {
      if (o !== null && typeof o === 'object' && !Array.isArray(o)) {
        return Object.keys(o)
          .sort()
          .reduce((acc, k) => ({ ...acc, [k]: sortKeys((o as Record<string, unknown>)[k]) }), {});
      }
      if (Array.isArray(o)) return o.map(sortKeys);
      return o;
    };
    return JSON.stringify(sortKeys(obj), null, 2);
  } catch {
    return null;
  }
}

export default function Toolbar({
  toolId,
  onRun,
  processing,
  toolName,
  toolIcon,
  base64Mode = 'encode',
  setBase64Mode,
  isJsonTool = false,
  showRun = false,
  showSort = true,
}: ToolbarProps) {
  const tool = TOOL_MAP[toolId];
  const input = useWorkspaceStore((s) => s.toolData[toolId]?.input ?? '');
  const output = useWorkspaceStore((s) => s.toolData[toolId]?.output ?? '');
  const setInput = useWorkspaceStore((s) => s.setInput);
  const clearInput = useWorkspaceStore((s) => s.clearInput);
  const addToast = useWorkspaceStore((s) => s.addToast);
  const setShowShortcutsModal = useWorkspaceStore((s) => s.setShowShortcutsModal);
  const toggleFullscreen = useWorkspaceStore((s) => s.toggleFullscreen);
  const isFullscreen = useWorkspaceStore((s) => s.isFullscreen);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadSample = () => {
    if (tool?.sampleInput) {
      setInput(toolId, tool.sampleInput);
      addToast('Sample data loaded', 'success');
    }
  };

  const handleCopyInput = async () => {
    if (!input) return;
    const ok = await copyToClipboard(input);
    addToast(ok ? 'Input copied' : 'Copy failed', ok ? 'success' : 'error');
  };

  const handleClear = () => {
    clearInput(toolId);
    addToast('Cleared', 'success');
  };

  const handleSortKeys = () => {
    const sorted = sortJsonKeys(input);
    if (sorted !== null) {
      setInput(toolId, sorted);
      addToast('Keys sorted alphabetically', 'success');
    } else {
      addToast('Invalid JSON', 'error');
    }
  };

  const handlePrint = () => {
    const content = [input && `=== Input ===\n${input}`, output && `=== Output ===\n${output}`]
      .filter(Boolean)
      .join('\n\n');
    if (!content.trim()) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Print</title></head>
        <body style="font-family: monospace; font-size: 14px; padding: 16px; white-space: pre-wrap; word-wrap: break-word;">
          <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(json|txt|xml|csv|yaml|yml)$/i)) {
      addToast('Only .json, .txt, .xml, .csv, .yaml, .yml files supported', 'error');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? '';
      setInput(toolId, text);
      addToast(`Loaded ${file.name}`, 'success');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const btnClass =
    'text-sm text-dt-text-muted hover:text-dt-text px-3 py-1.5 rounded-xl border border-dt-border hover:bg-dt-soft bg-dt-card transition-all duration-200';

  return (
    <div className="flex items-center gap-2.5 px-4 min-h-12 bg-dt-surface border border-dt-border rounded-dt-lg shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,.xml,.csv,.yaml,.yml"
        className="hidden"
        onChange={handleFileChange}
      />
      <span className="font-mono text-xs text-dt-text-dim w-6 text-center">{toolIcon}</span>
      <h1 className="text-sm font-semibold text-dt-text">{toolName}</h1>

      {toolId === 'base64' && setBase64Mode && (
        <div className="flex items-center gap-1 rounded-xl overflow-hidden border border-dt-border bg-dt-card">
          {(['encode', 'decode'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setBase64Mode(mode)}
              className={`text-xs px-3 py-1.5 capitalize transition-colors duration-200 ${
                base64Mode === mode ? 'bg-dt-soft text-dt-text' : 'text-dt-text-muted hover:text-dt-text'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      <div className="w-px h-5 bg-dt-border" />

      {showRun && (
        <button
          onClick={onRun}
          disabled={processing}
          className="flex items-center gap-2 text-sm font-medium bg-dt-soft hover:bg-dt-text hover:text-dt-bg disabled:opacity-50 text-dt-text px-4 py-1.5 rounded-xl border border-dt-border transition-all duration-200"
          title="Run (Ctrl+Enter)"
        >
          {processing ? <span className="animate-spin">⟳</span> : <span>▶</span>}
          Run
        </button>
      )}

      {isJsonTool && showSort && (
        <button onClick={handleSortKeys} className={btnClass} title="Sort object keys alphabetically">
          Sort
        </button>
      )}
      <button onClick={handleImport} className={btnClass} title="Import file">
        Import
      </button>
      <button onClick={handlePrint} disabled={!input && !output} className={btnClass} title="Print input and output data">
        Print
      </button>
      <button onClick={handleLoadSample} className={btnClass} title="Load sample data">
        Sample
      </button>
      <button onClick={handleClear} className={btnClass} title="Clear input and output">
        Clear
      </button>
      <button onClick={handleCopyInput} disabled={!input} className={btnClass} title="Copy input to clipboard">
        Copy
      </button>

      <div className="flex-1" />

      <button
        onClick={() => {
          if (!input.trim()) {
            addToast('No input to share', 'error');
            return;
          }
          const compressed = LZString.compressToEncodedURIComponent(input);
          if (compressed.length > 4000) {
            addToast('Input too large to share', 'error');
            return;
          }
          const mappedTool = TOOL_MAP[toolId];
          const base = typeof window !== 'undefined' ? window.location.origin : 'https://formatterjson.org';
          const url = `${base}${mappedTool?.route ?? '/json-formatter'}?data=${compressed}`;
          copyToClipboard(url).then((ok) => {
            addToast(ok ? 'Share link copied to clipboard' : 'Copy failed', ok ? 'success' : 'error');
          });
        }}
        disabled={!input}
        className={`${btnClass} disabled:opacity-30`}
        title="Copy shareable link"
      >
        Share
      </button>
      <button onClick={toggleFullscreen} className={btnClass} title="Toggle fullscreen (Ctrl+Shift+F)">
        {isFullscreen ? 'Exit' : 'Fullscreen'}
      </button>
      <button onClick={() => setShowShortcutsModal(true)} className={btnClass} title="Keyboard shortcuts (?)">
        ⌘ ?
      </button>
    </div>
  );
}
