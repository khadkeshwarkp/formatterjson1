'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SEARCH_INDEX } from '@/lib/search-index';

export default function SearchResults() {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();

  const results = useMemo(() => {
    if (!q) return [];
    const query = q.toLowerCase();
    return SEARCH_INDEX.filter((item) =>
      [item.title, item.description, item.category]
        .join(' ')
        .toLowerCase()
        .includes(query)
    ).slice(0, 60);
  }, [q]);

  if (!q) {
    return <p className="text-dt-text-muted">Type a query to search tools, guides, and blog posts.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-dt-text-muted">{results.length} result(s) for “{q}”.</p>
      <ul className="space-y-3">
        {results.map((item) => (
          <li key={item.href} className="rounded-xl border border-dt-border bg-dt-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-dt-text">
                <Link href={item.href} className="hover:text-dt-accent">
                  {item.title}
                </Link>
              </h3>
              <span className="text-xs text-dt-text-dim border border-dt-border rounded-full px-2 py-0.5">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-dt-text-muted mt-1">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
