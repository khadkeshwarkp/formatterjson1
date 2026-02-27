'use client';

import Link from 'next/link';
import { useWorkspaceStore } from '@/lib/store';
import { TOOL_MAP } from '@/lib/tools-registry';

export default function TabBar() {
  const { openTabs, activeTool, setActiveTool, closeTab } = useWorkspaceStore();

  return (
    <div
      role="tablist"
      aria-label="Open tools"
      className="mx-3 mb-0 mt-3 flex items-center h-12 px-2 gap-2 bg-dt-surface/90 backdrop-blur-dt border border-dt-border rounded-dt-lg overflow-x-auto"
    >
      <Link
        href="/json-tools"
        className="lg:hidden text-xs px-3 py-1.5 rounded-xl border border-dt-border bg-dt-card text-dt-text-muted hover:text-dt-text hover:bg-dt-soft transition-all duration-200 shrink-0"
      >
        Tools
      </Link>
      {openTabs.map((id) => {
        const tool = TOOL_MAP[id];
        if (!tool) return null;
        const isActive = activeTool === id;

        return (
          <div
            key={id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            className={`flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl text-xs cursor-pointer select-none transition-all duration-200 shrink-0 border ${
              isActive
                ? 'bg-dt-card text-dt-text border-dt-border shadow-dt-soft'
                : 'bg-transparent text-dt-text-muted border-transparent hover:bg-dt-soft/70 hover:text-dt-text'
            }`}
            onClick={() => {
              setActiveTool(id);
              window.history.pushState(null, '', tool.route);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTool(id);
                window.history.pushState(null, '', tool.route);
              }
            }}
          >
            <span className="font-mono text-[6px] w-5 text-center">{tool.icon}</span>
            <span className="font-medium">{tool.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(id);
              }}
              className="ml-0.5 p-1 rounded-lg text-dt-text-dim hover:text-dt-text hover:bg-dt-soft transition-colors duration-200"
              title="Close tab"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
