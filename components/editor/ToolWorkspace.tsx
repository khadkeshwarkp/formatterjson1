'use client';

import { useEffect, useCallback, useState, useRef, DragEvent } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { TOOL_MAP } from '@/lib/tools-registry';
import {
  jsonDiff,
  jsonDiffTwo,
  formatJson,
  validateJson,
  minifyJson,
  jsonToXml,
  jsonToCsv,
  jsonToYaml,
  csvToJson,
  yamlFormat,
  yamlToJson,
  jsonSchemaGenerate,
  jwtDecode,
  xmlFormat,
  xmlValidate,
  xmlToJson,
  htmlFormat,
  urlEncode,
  urlDecode,
  base64Encode,
  base64Decode,
  jsonToTypeScript,
  jsonToPython,
  jsonToJava,
  jsonToGo,
  jsonToCsharp,
  jsonToDart,
  jsonToRust,
  jsonToKotlin,
  jsonToSwift,
  jsonToPhp,
  sortJson,
  jsonEscape,
  jsonUnescape,
  jsonToHtmlTable,
  jsonToSql,
  jsonToTsv,
  loremIpsum,
  uuidGenerator,
  randomJsonGenerator,
  timestampConverter,
  regexTester,
  jwtGenerator,
  hashGenerator,
  colorConverter,
  textCaseConverter,
  type ProcessResult,
} from '@/lib/processors';
import MonacoWrapper from './MonacoWrapper';
import OutputPanel from './OutputPanel';
import Toolbar from './Toolbar';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { isInputOptionalTool } from '@/lib/input-placeholders';

interface ToolWorkspaceProps {
  toolId: string;
}

function getProcessor(toolId: string, base64Mode: 'encode' | 'decode') {
  switch (toolId) {
    case 'json-formatter': return formatJson;
    case 'json-validator': return validateJson;
    case 'json-minifier': return minifyJson;
    case 'json-to-xml': return jsonToXml;
    case 'json-to-csv': return jsonToCsv;
    case 'json-to-yaml': return jsonToYaml;
    case 'csv-to-json': return csvToJson;
    case 'json-schema-generator': return jsonSchemaGenerate;
    case 'yaml-formatter': return yamlFormat;
    case 'yaml-to-json': return yamlToJson;
    case 'xml-formatter': return xmlFormat;
    case 'xml-validator': return xmlValidate;
    case 'xml-to-json': return xmlToJson;
    case 'jwt-decoder': return jwtDecode;
    case 'html-formatter': return htmlFormat;
    case 'url-encode': return urlEncode;
    case 'url-decode': return urlDecode;
    case 'base64-encode': return base64Encode;
    case 'base64-decode': return base64Decode;
    case 'base64': return base64Mode === 'encode' ? base64Encode : base64Decode;
    case 'json-viewer':
    case 'json-parser':
    case 'json-pretty-print': return formatJson;
    case 'json-diff': return jsonDiff;
    case 'json-to-typescript': return jsonToTypeScript;
    case 'json-to-python': return jsonToPython;
    case 'json-to-java': return jsonToJava;
    case 'json-to-go': return jsonToGo;
    case 'json-to-csharp': return jsonToCsharp;
    case 'json-to-dart': return jsonToDart;
    case 'json-to-rust': return jsonToRust;
    case 'json-to-kotlin': return jsonToKotlin;
    case 'json-to-swift': return jsonToSwift;
    case 'json-to-php': return jsonToPhp;
    case 'json-compare':
    case 'json-diff': return jsonDiff;
    case 'json-sorter': return sortJson;
    case 'json-escape': return jsonEscape;
    case 'json-unescape': return jsonUnescape;
    case 'json-editor': return formatJson;
    case 'json-to-html-table': return jsonToHtmlTable;
    case 'json-to-sql': return jsonToSql;
    case 'json-to-excel': return jsonToCsv;
    case 'json-to-tsv': return jsonToTsv;
    case 'json-to-one-line': return minifyJson;
    case 'lorem-ipsum': return loremIpsum;
    case 'uuid-generator': return uuidGenerator;
    case 'random-json-generator': return randomJsonGenerator;
    case 'timestamp-converter': return timestampConverter;
    case 'regex-tester': return regexTester;
    case 'jwt-generator': return jwtGenerator;
    case 'hash-generator': return hashGenerator;
    case 'color-converter': return colorConverter;
    case 'text-case-converter': return textCaseConverter;
    default: return formatJson;
  }
}

function getOutputLanguage(toolId: string): string {
  if (['json-to-xml', 'xml-formatter'].includes(toolId)) return 'xml';
  if (['base64', 'base64-encode', 'base64-decode', 'json-validator', 'json-diff', 'xml-validator', 'url-encode', 'url-decode'].includes(toolId)) return 'text';
  if (['yaml-formatter', 'json-to-yaml'].includes(toolId)) return 'yaml';
  if (toolId === 'json-to-csv') return 'csv';
  if (toolId === 'html-formatter') return 'html';
  const codeConverters = ['json-to-typescript', 'json-to-python', 'json-to-java', 'json-to-go', 'json-to-csharp', 'json-to-dart', 'json-to-rust', 'json-to-kotlin', 'json-to-swift', 'json-to-php'];
  if (codeConverters.includes(toolId)) return 'plaintext';
  if (['json-to-html-table'].includes(toolId)) return 'html';
  if (['json-escape', 'json-unescape', 'json-to-sql', 'json-to-tsv', 'json-compare'].includes(toolId)) return 'text';
  if (toolId === 'json-to-excel') return 'csv';
  const utilityText = ['lorem-ipsum', 'uuid-generator', 'timestamp-converter', 'regex-tester', 'jwt-generator', 'hash-generator', 'color-converter', 'text-case-converter'];
  if (utilityText.includes(toolId)) return 'text';
  if (toolId === 'random-json-generator') return 'json';
  return 'json';
}

function getInputLanguage(toolId: string): string {
  if (['base64', 'base64-encode', 'base64-decode', 'jwt-decoder', 'url-encode', 'url-decode'].includes(toolId)) return 'plaintext';
  if (['yaml-formatter', 'yaml-to-json'].includes(toolId)) return 'yaml';
  if (['xml-formatter', 'xml-validator', 'xml-to-json'].includes(toolId)) return 'xml';
  if (['csv-to-json', 'html-formatter', 'json-escape', 'json-unescape'].includes(toolId)) return 'plaintext';
  const utilityPlain = ['lorem-ipsum', 'uuid-generator', 'random-json-generator', 'timestamp-converter', 'regex-tester', 'hash-generator', 'color-converter', 'text-case-converter'];
  if (utilityPlain.includes(toolId)) return 'plaintext';
  if (toolId === 'jwt-generator') return 'json';
  return 'json';
}

// Multi-convert targets
const CONVERT_TARGETS = [
  { id: 'json-formatter', label: 'Format', processor: formatJson },
  { id: 'json-minifier', label: 'Minify', processor: minifyJson },
  { id: 'json-to-xml', label: 'XML', processor: jsonToXml },
  { id: 'json-to-csv', label: 'CSV', processor: jsonToCsv },
  { id: 'json-to-yaml', label: 'YAML', processor: jsonToYaml },
] as const;

export default function ToolWorkspace({ toolId }: ToolWorkspaceProps) {
  const tool = TOOL_MAP[toolId];
  const setOutput = useWorkspaceStore((s) => s.setOutput);
  const setInput = useWorkspaceStore((s) => s.setInput);
  const input = useWorkspaceStore((s) => s.toolData[toolId]?.input ?? '');
  const input2 = useWorkspaceStore((s) => s.toolData[toolId]?.input2 ?? '');
  const base64Mode = useWorkspaceStore((s) => s.base64Mode);
  const setBase64Mode = useWorkspaceStore((s) => s.setBase64Mode);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const toggleFullscreen = useWorkspaceStore((s) => s.toggleFullscreen);
  const panelFullscreen = useWorkspaceStore((s) => s.panelFullscreen);
  const setPanelFullscreen = useWorkspaceStore((s) => s.setPanelFullscreen);
  const setShowShortcutsModal = useWorkspaceStore((s) => s.setShowShortcutsModal);
  const addToast = useWorkspaceStore((s) => s.addToast);

  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const isTwoPanelDiff = toolId === 'json-diff' || toolId === 'json-compare';
  const runTool = useCallback(() => {
    setProcessing(true);
    const run = async () => {
      try {
        if (isTwoPanelDiff) {
          const result = jsonDiffTwo(input, input2);
          setOutput(toolId, result.output);
          setError(result.error);
          if (result.error) addToast(result.error, 'error');
        } else {
          const processor = getProcessor(toolId, base64Mode);
          const maybePromise = processor(input);
          const result: ProcessResult = await Promise.resolve(maybePromise);
          setOutput(toolId, result.output);
          setError(result.error);
          if (result.error) addToast(result.error, 'error');
        }
      } finally {
        setProcessing(false);
      }
    };
    run();
  }, [toolId, input, input2, base64Mode, setOutput, addToast, isTwoPanelDiff]);

  // Auto-run on input change (debounced). For input-optional tools, run when empty too (default output).
  const inputOptional = isInputOptionalTool(toolId);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (toolId === 'json-diff' || toolId === 'json-compare') {
        if (input || input2) runTool();
      } else if (inputOptional || input) runTool();
    }, 300);
    return () => clearTimeout(timer);
  }, [toolId, input, input2, runTool, inputOptional]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      // ? for shortcuts modal (only when not typing in input)
      if (e.key === '?' && !mod && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      if (mod && e.key === 'Enter') {
        e.preventDefault();
        runTool();
      }
      if (mod && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        if (toolId.startsWith('json')) {
          const result = minifyJson(input);
          setOutput(toolId, result.output);
          setError(result.error);
        }
      }
      if (mod && (e.key === 'b' || e.key === 'B') && !e.shiftKey) {
        e.preventDefault();
        toggleSidebar();
      }
      if (mod && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runTool, toolId, input, setOutput, toggleSidebar, toggleFullscreen, setShowShortcutsModal]);

  // Resizable split
  const onMouseDown = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(80, Math.max(20, pct)));
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Drag-and-drop file upload
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(json|txt|xml|csv|yaml|yml)$/i)) {
      addToast('Only .json, .txt, .xml, .csv, .yaml, .yml files supported', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInput(toolId, text);
      addToast(`Loaded ${file.name}`, 'success');
    };
    reader.readAsText(file);
  };

  // Multi-convert handler
  const handleMultiConvert = (processor: (input: string) => ProcessResult) => {
    const result = processor(input);
    setOutput(toolId, result.output);
    setError(result.error);
    if (result.error) addToast(result.error, 'error');
  };

  if (!tool) return <div className="p-4 text-dt-error">Unknown tool: {toolId}</div>;

  const isJsonTool = toolId.startsWith('json');

  return (
    <div
      className="flex flex-col h-full relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-dt-accent/10 border-2 border-dashed border-dt-accent rounded-lg flex items-center justify-center">
          <span className="text-lg font-semibold text-dt-accent">Drop file to load</span>
        </div>
      )}

      {/* Unified toolbar row (header + toolbar merged) */}
      <Toolbar
        toolId={toolId}
        onRun={runTool}
        processing={processing}
        toolName={tool.name}
        toolIcon={tool.icon}
        base64Mode={base64Mode}
        setBase64Mode={setBase64Mode}
        isJsonTool={isJsonTool}
      />

      {/* Panel fullscreen: show only input or only output with exit button */}
      {panelFullscreen === 'input' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-3 py-1.5 bg-dt-surface border-b border-dt-border shrink-0">
            <span className="text-sm font-medium text-dt-text">Input — Fullscreen</span>
            <button
              onClick={() => setPanelFullscreen('none')}
              className="text-sm font-medium px-3 py-1 rounded-lg bg-dt-accent/20 text-dt-accent hover:bg-dt-accent hover:text-white border border-dt-accent/50 transition-colors"
              title="Exit fullscreen"
            >
              ⊟ Exit fullscreen
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <MonacoWrapper toolId={toolId} language={getInputLanguage(toolId)} />
          </div>
        </div>
      )}

      {panelFullscreen === 'output' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-3 py-1.5 bg-dt-surface border-b border-dt-border shrink-0">
            <span className="text-sm font-medium text-dt-text">Output — Fullscreen</span>
            <button
              onClick={() => setPanelFullscreen('none')}
              className="text-sm font-medium px-3 py-1 rounded-lg bg-dt-accent/20 text-dt-accent hover:bg-dt-accent hover:text-white border border-dt-accent/50 transition-colors"
              title="Exit fullscreen"
            >
              ⊟ Exit fullscreen
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <OutputPanel toolId={toolId} error={error} outputLanguage={getOutputLanguage(toolId)} />
          </div>
        </div>
      )}

      {/* Split panels — json-diff / json-compare: side-by-side inputs + output below; else: input | output */}
      {panelFullscreen === 'none' && isTwoPanelDiff ? (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 min-h-0 border-b border-dt-border">
            <div className="flex-1 min-w-0 flex flex-col border-r border-dt-border">
              <div className="px-2 py-1 text-[10px] text-dt-text-dim uppercase border-b border-dt-border bg-dt-surface">Left JSON</div>
              <div className="flex-1 min-h-0 shadow-[inset_2px_0_8px_rgba(0,0,0,0.15)]">
                <MonacoWrapper toolId={toolId} language="json" variant="left" />
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="px-2 py-1 text-[10px] text-dt-text-dim uppercase border-b border-dt-border bg-dt-surface">Right JSON</div>
              <div className="flex-1 min-h-0">
                <MonacoWrapper toolId={toolId} language="json" variant="right" />
              </div>
            </div>
          </div>
          <div className="h-[40%] min-h-[120px] flex flex-col border-t border-dt-border">
            <div className="px-2 py-1 text-[10px] text-dt-text-dim uppercase border-b border-dt-border bg-dt-surface">Differences</div>
            <div className="flex-1 min-h-0">
              <OutputPanel toolId={toolId} error={error} outputLanguage="text" />
            </div>
          </div>
        </div>
      ) : panelFullscreen === 'none' && inputOptional ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <OutputPanel toolId={toolId} error={error} outputLanguage={getOutputLanguage(toolId)} showOutputOnlyHint />
        </div>
      ) : panelFullscreen === 'none' ? (
        <div ref={containerRef} className="flex flex-1 min-h-0">
          <div style={{ width: `${splitPercent}%` }} className="min-w-0 shadow-[inset_2px_0_8px_rgba(0,0,0,0.15)]">
            <MonacoWrapper toolId={toolId} language={getInputLanguage(toolId)} />
          </div>
          <div className="resizer" onMouseDown={onMouseDown} />
          <div style={{ width: `${100 - splitPercent}%` }} className="min-w-0">
            <OutputPanel toolId={toolId} error={error} outputLanguage={getOutputLanguage(toolId)} />
          </div>
        </div>
      ) : null}

      {/* Multi-convert bar (for JSON tools) */}
      {isJsonTool && input && (
        <div className="flex items-center gap-2 px-3 h-9 bg-dt-surface border-t border-dt-border shrink-0">
          <span className="text-[10px] text-dt-text-dim uppercase tracking-wider mr-1">Convert to:</span>
          {CONVERT_TARGETS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleMultiConvert(t.processor)}
              className="text-xs px-2.5 py-1 rounded bg-dt-bg border border-dt-border text-dt-text-muted hover:text-dt-text hover:border-dt-accent transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Shortcuts modal */}
      <KeyboardShortcutsModal />
    </div>
  );
}
