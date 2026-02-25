'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useWorkspaceStore } from '@/lib/store';
import { TOOLS, CATEGORIES, TOOL_MAP } from '@/lib/tools-registry';

export default function Sidebar() {
  const { activeTool, sidebarCollapsed, toggleSidebar, openTab, recentTools, favoriteTools, toggleFavorite, theme, toggleTheme } =
    useWorkspaceStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return TOOLS;
    const q = search.toLowerCase();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    );
  }, [search]);

  const currentThemeLabel = theme[0].toUpperCase() + theme.slice(1);
  const nextThemeLabel = theme === 'light' ? 'Dark' : theme === 'dark' ? 'Black' : 'Light';

  if (sidebarCollapsed) {
    return (
      <aside className="m-3 mr-0 flex flex-col items-center w-16 bg-dt-sidebar/90 backdrop-blur-dt border border-dt-border py-3 rounded-dt-lg flex-shrink-0 shadow-dt-panel">
        <button
          onClick={toggleSidebar}
          className="text-dt-text-muted hover:text-dt-text p-2 rounded-xl hover:bg-dt-soft transition-colors duration-200"
          title="Expand sidebar"
        >
          ☰
        </button>
        <div className="flex-1" />
        <button
          onClick={toggleTheme}
          className="text-dt-text-muted hover:text-dt-text p-2 rounded-xl hover:bg-dt-soft transition-colors duration-200"
          title={`Switch to ${nextThemeLabel} theme`}
        >
          ◐
        </button>
      </aside>
    );
  }

  return (
    <aside className="m-3 mr-0 flex flex-col w-[240px] bg-dt-sidebar/90 backdrop-blur-dt border border-dt-border flex-shrink-0 rounded-dt-lg shadow-dt-panel">
      <div className="flex items-center justify-between px-4 h-12 border-b border-dt-border">
        <span className="text-sm font-semibold text-dt-text tracking-wide">DevTools</span>
        <button
          onClick={toggleSidebar}
          className="text-dt-text-muted hover:text-dt-text hover:bg-dt-soft rounded-xl p-1.5 transition-colors duration-200"
          title="Collapse sidebar"
        >
          ✕
        </button>
      </div>

      <div className="px-3 py-3">
        <input
          type="text"
          placeholder="Search tools"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dt-card border border-dt-border rounded-2xl px-3 py-2.5 text-sm text-dt-text placeholder:text-dt-text-dim focus:outline-none focus:border-dt-text-dim/50 focus:ring-0 transition-all duration-200"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-1 pb-2">
        {!search && favoriteTools.length > 0 && (
          <div className="mb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1.5">
              Favorites
            </h3>
            {favoriteTools.map((id) => {
              const tool = TOOL_MAP[id];
              if (!tool) return null;
              return (
                <SidebarItem
                  key={`fav-${id}`}
                  tool={tool}
                  active={activeTool === id}
                  onSelect={() => openTab(id)}
                  isFavorite
                  onToggleFavorite={() => toggleFavorite(id)}
                />
              );
            })}
          </div>
        )}

        {!search && recentTools.length > 0 && (
          <div className="mb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1.5">
              Recent
            </h3>
            {recentTools.map((id) => {
              const tool = TOOL_MAP[id];
              if (!tool) return null;
              return (
                <SidebarItem
                  key={`recent-${id}`}
                  tool={tool}
                  active={activeTool === id}
                  onSelect={() => openTab(id)}
                  isFavorite={favoriteTools.includes(id)}
                  onToggleFavorite={() => toggleFavorite(id)}
                />
              );
            })}
          </div>
        )}

        {CATEGORIES.map((cat) => {
          const tools = filtered.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <div key={cat.id} className="mb-2">
              <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1.5">
                {cat.label}
              </h3>
              {tools.map((tool) => (
                <SidebarItem
                  key={tool.id}
                  tool={tool}
                  active={activeTool === tool.id}
                  onSelect={() => openTab(tool.id)}
                  isFavorite={favoriteTools.includes(tool.id)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-dt-border px-3 py-3 flex items-center justify-between">
        <button
          onClick={toggleTheme}
          className="text-dt-text-muted hover:text-dt-text text-xs flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-dt-soft transition-colors duration-200"
          title={`Switch to ${nextThemeLabel} theme`}
        >
          <span className="font-medium">Theme: {currentThemeLabel}</span>
          <span className="text-dt-text-dim">→ {nextThemeLabel}</span>
        </button>
        <span className="text-[10px] text-dt-text-dim">v1.0</span>
      </div>
    </aside>
  );
}

function SidebarItem({
  tool,
  active,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}: {
  tool: { id: string; name: string; icon: string; route: string };
  active: boolean;
  onSelect: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  return (
    <Link
      href={tool.route}
      onClick={() => onSelect()}
      className={`group flex items-center gap-2.5 pl-3.5 pr-3 py-2.5 mx-2 rounded-2xl text-sm transition-all duration-200 border border-transparent ${
        active
          ? 'bg-dt-soft text-dt-text border-dt-border shadow-dt-soft'
          : 'text-dt-text-muted hover:bg-dt-soft/70 hover:text-dt-text'
      }`}
    >
      <span className="w-6 text-center text-xs font-mono shrink-0">{tool.icon}</span>
      <span className="truncate flex-1">{tool.name}</span>
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`text-xs shrink-0 transition-opacity ${
            isFavorite
              ? 'text-dt-text-muted opacity-100'
              : 'text-dt-text-dim opacity-0 group-hover:opacity-70 hover:!opacity-100'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </Link>
  );
}
