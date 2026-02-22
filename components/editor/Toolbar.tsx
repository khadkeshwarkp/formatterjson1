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

  return (
    <div className="flex items-center gap-2 px-3 h-9 bg-gradient-to-r from-dt-surface to-dt-bg border-b border-dt-border shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,.xml,.csv,.yaml,.yml"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Tool identity */}
      <span className="font-mono text-xs text-dt-text-dim">{toolIcon}</span>
      <h1 className="text-sm font-semibold text-dt-text mr-1">{toolName}</h1>

      {toolId === 'base64' && setBase64Mode && (
        <div className="flex items-center gap-1">
          {(['encode', 'decode'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setBase64Mode(mode)}
              className={`text-xs px-2 py-0.5 rounded capitalize ${
                base64Mode === mode
                  ? 'bg-dt-accent text-white'
                  : 'text-dt-text-muted bg-dt-bg hover:text-dt-text'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      <div className="w-px h-4 bg-dt-border" />

      {/* Run */}
      <button
        onClick={onRun}
        disabled={processing}
        className="flex items-center gap-1 text-sm font-medium bg-dt-accent hover:bg-dt-accent-hover disabled:opacity-50 text-white px-3 py-1 rounded-lg border border-dt-accent transition-colors"
        title="Run (Ctrl+Enter)"
      >
        {processing ? <span className="animate-spin">⟳</span> : <span>▶</span>}
        Run
      </button>

      {/* Sort keys (JSON tools) */}
      {isJsonTool && (
        <button
          onClick={handleSortKeys}
          className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
          title="Sort object keys alphabetically"
        >
          A→Z Sort
        </button>
      )}

      {/* Import */}
      <button
        onClick={handleImport}
        className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Import file"
      >
        📂 Import
      </button>

      {/* Print */}
      <button
        onClick={handlePrint}
        disabled={!input && !output}
        className="text-sm text-dt-text-muted hover:text-dt-text disabled:opacity-30 px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Print input and output data"
      >
        🖨 Print
      </button>

      {/* Load Sample */}
      <button
        onClick={handleLoadSample}
        className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Load sample data"
      >
        📋 Sample
      </button>

      {/* Clear */}
      <button
        onClick={handleClear}
        className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Clear input and output"
      >
        ✕ Clear
      </button>

      {/* Copy Input */}
      <button
        onClick={handleCopyInput}
        disabled={!input}
        className="text-sm text-dt-text-muted hover:text-dt-text disabled:opacity-30 px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Copy input to clipboard"
      >
        ⎘ Copy
      </button>

      <div className="flex-1" />

      {/* Share */}
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
          const tool = TOOL_MAP[toolId];
          const base = typeof window !== 'undefined' ? window.location.origin : 'https://formatterjson.org';
          const url = `${base}${tool?.route ?? '/json-formatter'}?data=${compressed}`;
          copyToClipboard(url).then((ok) => {
            addToast(ok ? 'Share link copied to clipboard' : 'Copy failed', ok ? 'success' : 'error');
          });
        }}
        disabled={!input}
        className="flex items-center gap-1.5 text-sm font-medium bg-dt-accent/20 text-dt-accent hover:bg-dt-accent hover:text-white disabled:opacity-30 px-3 py-1 rounded-lg border border-dt-accent/50 transition-colors"
        title="Copy shareable link"
      >
        🔗 Share
      </button>

      {/* Fullscreen (whole workspace) */}
      <button
        onClick={toggleFullscreen}
        className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Toggle fullscreen (Ctrl+Shift+F)"
      >
        {isFullscreen ? '⊟ Exit' : '⊞ Fullscreen'}
      </button>

      {/* Shortcuts */}
      <button
        onClick={() => setShowShortcutsModal(true)}
        className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
        title="Keyboard shortcuts (?)"
      >
        ⌘ ?
      </button>
    </div>
  );
}
