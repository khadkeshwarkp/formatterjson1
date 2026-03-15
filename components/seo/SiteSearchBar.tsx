'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteSearchBar({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search/?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      action="/search/"
      method="get"
      className={`flex items-center gap-2 ${className}`}
      role="search"
    >
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools and guides"
        className="w-full md:w-64 rounded-xl border border-dt-border bg-dt-surface px-3 py-2 text-sm text-dt-text placeholder:text-dt-text-dim focus:outline-none focus:border-dt-accent"
        aria-label="Search formatterjson.org"
      />
      <button
        type="submit"
        className="rounded-xl bg-dt-accent px-3 py-2 text-xs font-semibold text-white hover:bg-dt-accent-hover transition-colors"
      >
        Search
      </button>
    </form>
  );
}
