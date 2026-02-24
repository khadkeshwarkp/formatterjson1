'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { getOutputPlaceholder } from '@/lib/input-placeholders';
import { defineWorkspaceMonacoThemes, getMonacoTheme } from '@/lib/monaco-theme';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function OutputPlaceholderText({ text }: { text: string }) {
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

interface OutputPanelProps {
  toolId: string;
  error?: string | null;
  outputLanguage?: string;
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

  const monacoLang =
    isXml ? 'xml'
    : outputLanguage === 'text' ? 'plaintext'
    : outputLanguage === 'yaml' ? 'yaml'
    : outputLanguage === 'html' ? 'html'
    : 'json';

  const showOutputPlaceholder = !error && !output.trim();
  const outputPlaceholder = getOutputPlaceholder(toolId);

  const panelBtnClass =
    'text-sm text-dt-text-muted hover:text-dt-text px-3 py-1.5 rounded-xl border border-dt-border hover:bg-dt-soft bg-dt-card transition-all duration-200';

  return (
    <div className="flex flex-col h-full min-h-[70vh] rounded-dt-lg overflow-hidden bg-dt-card/92 backdrop-blur-dt border border-dt-border shadow-dt-panel transition-all duration-200 hover:shadow-dt-soft focus-within:shadow-dt-soft">
      {showOutputOnlyHint && (
        <div className="shrink-0 px-4 py-2.5 bg-dt-surface border-b border-dt-border text-sm text-dt-text-muted">
          <OutputPlaceholderText text={outputPlaceholder} />
        </div>
      )}
      <div className="relative z-20 flex items-center gap-2 px-3 py-2.5 min-h-12 bg-dt-surface border-b border-dt-border shrink-0 sticky top-0">
        <span className="text-sm font-medium text-dt-text-muted mr-auto">Output</span>
        {!error && !treeView && (
          <>
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSearchOutput(); }} className={panelBtnClass} title="Search (Ctrl+F)">
              Search
            </button>
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPanelFullscreen(panelFullscreen === 'output' ? 'none' : 'output'); }} className={panelBtnClass} title={panelFullscreen === 'output' ? 'Exit fullscreen' : 'Fullscreen output panel'}>
              {panelFullscreen === 'output' ? 'Exit' : 'Fullscreen'}
            </button>
          </>
        )}
        {isXml && output && (
          <>
            <button onClick={handleFormatXml} className={panelBtnClass}>Format</button>
            <button onClick={handleMinifyXml} className={panelBtnClass}>Minify</button>
          </>
        )}
        {canTreeView && (
          <button
            onClick={() => setTreeView(!treeView)}
            className={`text-sm px-3 py-1.5 rounded-xl border transition-all duration-200 ${
              treeView ? 'bg-dt-soft text-dt-text border-dt-border' : panelBtnClass
            }`}
          >
            Tree
          </button>
        )}
        <button onClick={handleCopy} disabled={!output} className={`${panelBtnClass} disabled:opacity-30`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button onClick={handleDownload} disabled={!output} className={`${panelBtnClass} disabled:opacity-30`}>
          Download
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        <div
          className={`absolute inset-0 flex items-center justify-center px-8 text-center pointer-events-none z-10 text-sm text-dt-text-muted leading-relaxed transition-opacity duration-200 ${showOutputPlaceholder && !showOutputOnlyHint ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <OutputPlaceholderText text={outputPlaceholder} />
        </div>
        {error ? (
          <div className="p-4 text-dt-error whitespace-pre-wrap font-mono text-sm">{error}</div>
        ) : treeView && parsedTree !== null ? (
          <div className="overflow-auto h-full p-3 font-mono text-sm">
            <TreeNode data={parsedTree} label="root" depth={0} />
          </div>
        ) : (
          <Editor
            height="100%"
            language={monacoLang}
            value={output}
            beforeMount={defineWorkspaceMonacoThemes}
            onMount={(editor) => { outputEditorRef.current = editor; }}
            theme={getMonacoTheme(theme)}
            options={{
              readOnly: true,
              fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace',
              fontSize: 15,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 14, bottom: 16 },
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
        <span className="text-dt-text">{label}:</span>
        <span className="text-dt-text-dim">null</span>
      </div>
    );
  }

  if (typeof data !== 'object') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="flex items-center gap-1 py-0.5">
        <span className="text-dt-text">{label}:</span>
        <span className="text-dt-text-muted">
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
        className="flex items-center gap-1 py-0.5 cursor-pointer hover:bg-dt-soft/70 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-dt-text-dim text-[10px] w-3">{expanded ? '▼' : '▶'}</span>
        <span className="text-dt-text">{label}:</span>
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
