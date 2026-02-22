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

  if (sidebarCollapsed) {
    return (
      <aside className="flex flex-col items-center w-12 bg-dt-sidebar border-r border-dt-border py-2 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="text-dt-text-muted hover:text-dt-text p-2 text-lg"
          title="Expand sidebar"
        >
          ☰
        </button>
        <div className="flex-1" />
        <button
          onClick={toggleTheme}
          className="text-dt-text-muted hover:text-dt-text p-2 text-sm"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-[240px] bg-dt-sidebar border-r border-dt-border flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-dt-border">
        <span className="text-sm font-semibold text-dt-text tracking-wide">DevTools</span>
        <button
          onClick={toggleSidebar}
          className="text-dt-text-muted hover:text-dt-text text-xs p-1"
          title="Collapse sidebar"
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Search tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dt-bg border border-dt-border rounded px-2 py-1.5 text-sm text-dt-text placeholder:text-dt-text-dim focus:outline-none focus:border-dt-accent"
        />
      </div>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto px-1">
        {/* Favorites */}
        {!search && favoriteTools.length > 0 && (
          <div className="mb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1">
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

        {/* Recent */}
        {!search && recentTools.length > 0 && (
          <div className="mb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1">
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

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const tools = filtered.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <div key={cat.id} className="mb-2">
              <h3 className="text-[10px] uppercase tracking-widest text-dt-text-dim px-2 py-1">
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

      {/* Footer */}
      <div className="border-t border-dt-border px-3 py-2 flex items-center justify-between">
        <button
          onClick={toggleTheme}
          className="text-dt-text-muted hover:text-dt-text text-xs flex items-center gap-1"
        >
          {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
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
      onClick={(e) => {
        onSelect();
      }}
      className={`group flex items-center gap-2 px-2 py-1 mx-1 rounded text-sm transition-colors ${
        active
          ? 'bg-dt-accent/20 text-dt-accent'
          : 'text-dt-text-muted hover:bg-dt-surface hover:text-dt-text'
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
              ? 'text-yellow-400 opacity-100'
              : 'text-dt-text-dim opacity-0 group-hover:opacity-60 hover:!opacity-100'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </Link>
  );
}
