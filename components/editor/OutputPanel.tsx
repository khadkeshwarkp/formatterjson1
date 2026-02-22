'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { getOutputPlaceholder } from '@/lib/input-placeholders';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function OutputPlaceholderText({ text }: { text: string }) {
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

interface OutputPanelProps {
  toolId: string;
  error?: string | null;
  outputLanguage?: string;
  /** When true, show a hint that input is optional (output-only layout). */
  showOutputOnlyHint?: boolean;
}

export default function OutputPanel({ toolId, error, outputLanguage = 'json', showOutputOnlyHint = false }: OutputPanelProps) {
  const output = useWorkspaceStore((s) => s.toolData[toolId]?.output ?? '');
  const setOutput = useWorkspaceStore((s) => s.setOutput);
  const addToast = useWorkspaceStore((s) => s.addToast);
  const theme = useWorkspaceStore((s) => s.theme);
  const setPanelFullscreen = useWorkspaceStore((s) => s.setPanelFullscreen);
  const panelFullscreen = useWorkspaceStore((s) => s.panelFullscreen);
  const [copied, setCopied] = useState(false);
  const [treeView, setTreeView] = useState(false);

  const canTreeView = outputLanguage === 'json' && !error;
  const isXml = outputLanguage === 'xml';

  const parsedTree = useMemo(() => {
    if (!canTreeView || !treeView || !output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [canTreeView, treeView, output]);

  const outputEditorRef = useRef<unknown>(null);
  const handleSearchOutput = useCallback(() => {
    const ed = outputEditorRef.current as { focus(): void; getAction(id: string): { run(): void } | null; trigger?(source: string, handlerId: string, payload: unknown): void } | null;
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

  const handleCopy = async () => {
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const extByLanguage: Record<string, string> = {
      xml: 'xml',
      text: 'txt',
      csv: 'csv',
      yaml: 'yaml',
      html: 'html',
      json: 'json',
    };
    const extByToolId: Record<string, string> = {
      'json-to-xml': 'xml',
      'xml-formatter': 'xml',
      'json-validator': 'txt',
      'xml-validator': 'txt',
      'json-to-csv': 'csv',
      'yaml-formatter': 'yaml',
      'json-to-yaml': 'yaml',
      'yaml-to-json': 'json',
      'csv-to-json': 'json',
      'xml-to-json': 'json',
      'html-formatter': 'html',
      'base64': 'txt',
      'base64-encode': 'txt',
      'base64-decode': 'txt',
      'url-encode': 'txt',
      'url-decode': 'txt',
      'jwt-decoder': 'json',
      'json-diff': 'txt',
    };
    const ext = extByLanguage[outputLanguage] ?? extByToolId[toolId] ?? 'json';
    downloadText(output, `output.${ext}`);
  };

  const handleMinifyXml = () => {
    if (!output) return;
    const minified = output.replace(/>\s+</g, '><').replace(/\n\s*/g, '').trim();
    setOutput(toolId, minified);
    addToast('XML minified', 'success');
  };

  const handleFormatXml = () => {
    if (!output) return;
    // Simple XML formatter: add indentation
    let formatted = '';
    let indent = 0;
    const parts = output.replace(/>\s*</g, '>\n<').split('\n');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + trimmed + '\n';
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent++;
      }
    }
    setOutput(toolId, formatted.trimEnd());
    addToast('XML formatted', 'success');
  };

  // Determine Monaco language for output
  const monacoLang =
    isXml ? 'xml'
    : outputLanguage === 'text' ? 'plaintext'
    : outputLanguage === 'yaml' ? 'yaml'
    : outputLanguage === 'html' ? 'html'
    : 'json';

  const showOutputPlaceholder = !error && !output.trim();
  const outputPlaceholder = getOutputPlaceholder(toolId);

  return (
    <div className="flex flex-col h-full bg-dt-bg">
      {showOutputOnlyHint && (
        <div className="shrink-0 px-3 py-2 bg-dt-surface/80 border-b border-dt-border text-sm text-dt-text-muted">
          <OutputPlaceholderText text={outputPlaceholder} />
        </div>
      )}
      {/* Toolbar */}
      <div className="relative z-20 flex items-center gap-2 px-3 h-9 bg-dt-surface border-b border-dt-border shrink-0 pointer-events-auto">
        <span className="text-sm font-medium text-dt-text-muted mr-auto">Output</span>
        {!error && !treeView && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSearchOutput(); }}
              className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors flex items-center gap-1 cursor-pointer"
              title="Search (Ctrl+F)"
            >
              🔍 Search
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPanelFullscreen(panelFullscreen === 'output' ? 'none' : 'output'); }}
              className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors cursor-pointer"
              title={panelFullscreen === 'output' ? 'Exit fullscreen' : 'Fullscreen output panel'}
            >
              {panelFullscreen === 'output' ? '⊟ Exit fullscreen' : '⊞ Fullscreen'}
            </button>
          </>
        )}
        {isXml && output && (
          <>
            <button
              onClick={handleFormatXml}
              className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
            >
              Format
            </button>
            <button
              onClick={handleMinifyXml}
              className="text-sm text-dt-text-muted hover:text-dt-text px-2.5 py-1 rounded-md border border-dt-border hover:border-dt-accent bg-dt-bg transition-colors"
            >
              Minify
            </button>
          </>
        )}
        {canTreeView && (
          <button
            onClick={() => setTreeView(!treeView)}
            className={`text-sm px-2.5 py-1 rounded-md border transition-colors ${
              treeView
                ? 'bg-dt-accent text-white border-dt-accent'
                : 'text-dt-text-muted hover:text-dt-text bg-dt-bg border-dt-border hover:border-dt-accent'
            }`}
          >
            Tree
          </button>
        )}
        <button
          onClick={handleCopy}
          disabled={!output}
          className="text-sm text-dt-text-muted hover:text-dt-text disabled:opacity-30 px-2.5 py-1 rounded-md border border-dt-border bg-dt-bg hover:border-dt-accent transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          disabled={!output}
          className="text-sm text-dt-text-muted hover:text-dt-text disabled:opacity-30 px-2.5 py-1 rounded-md border border-dt-border bg-dt-bg hover:border-dt-accent transition-colors"
        >
          Download
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative">
        {showOutputPlaceholder && !showOutputOnlyHint && (
          <div
            className="absolute inset-0 flex items-start pt-3 px-4 pointer-events-none z-10 text-sm text-dt-text-muted leading-relaxed"
            aria-hidden
          >
            <OutputPlaceholderText text={outputPlaceholder} />
          </div>
        )}
        {error ? (
          <div className="p-3 text-dt-error whitespace-pre-wrap font-mono text-sm">{error}</div>
        ) : treeView && parsedTree !== null ? (
          <div className="overflow-auto h-full p-3 font-mono text-sm">
            <TreeNode data={parsedTree} label="root" depth={0} />
          </div>
        ) : (
          <Editor
            height="100%"
            language={monacoLang}
            value={output}
            onMount={(editor) => { outputEditorRef.current = editor; }}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 8 },
              lineNumbersMinChars: 3,
              renderLineHighlight: 'none',
              domReadOnly: false,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Recursive Tree View ─────────────────────────────────────────
function TreeNode({
  data,
  label,
  depth,
}: {
  data: unknown;
  label: string;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (data === null) {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="flex items-center gap-1 py-0.5">
        <span className="text-dt-accent">{label}:</span>
        <span className="text-dt-text-dim">null</span>
      </div>
    );
  }

  if (typeof data !== 'object') {
    const color =
      typeof data === 'string'
        ? 'text-green-400'
        : typeof data === 'number'
          ? 'text-pink-400'
          : typeof data === 'boolean'
            ? 'text-yellow-400'
            : 'text-dt-text';
    return (
      <div style={{ paddingLeft: depth * 16 }} className="flex items-center gap-1 py-0.5">
        <span className="text-dt-accent">{label}:</span>
        <span className={color}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((v, i) => [String(i), v] as const)
    : Object.entries(data);
  const bracket = Array.isArray(data) ? ['[', ']'] : ['{', '}'];

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        className="flex items-center gap-1 py-0.5 cursor-pointer hover:bg-dt-surface/50 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-dt-text-dim text-[10px] w-3">{expanded ? '▼' : '▶'}</span>
        <span className="text-dt-accent">{label}:</span>
        <span className="text-dt-text-dim text-xs">
          {bracket[0]} {entries.length} {entries.length === 1 ? 'item' : 'items'} {bracket[1]}
        </span>
      </div>
      {expanded &&
        entries.map(([key, value]) => (
          <TreeNode key={key} data={value} label={key} depth={depth + 1} />
        ))}
    </div>
  );
}
