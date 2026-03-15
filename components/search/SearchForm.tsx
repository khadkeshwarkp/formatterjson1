'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get('q') || '').trim();
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search/?q=${encodeURIComponent(q)}` : '/search/');
  };

  return (
    <form
      onSubmit={onSubmit}
      action="/search/"
      method="get"
      className="mb-6 flex flex-col sm:flex-row gap-3"
      role="search"
    >
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools, guides, errors, conversions..."
        className="flex-1 rounded-xl border border-dt-border bg-dt-surface px-4 py-3 text-base text-dt-text placeholder:text-dt-text-dim focus:outline-none focus:border-dt-accent"
        aria-label="Search formatterjson.org"
      />
      <button
        type="submit"
        className="rounded-xl bg-dt-accent px-5 py-3 text-sm font-semibold text-white hover:bg-dt-accent-hover"
      >
        Search
      </button>
    </form>
  );
}
