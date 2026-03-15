import type { Metadata } from 'next';
import { Suspense } from 'react';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import SearchResults from '@/components/search/SearchResults';
import SearchForm from '@/components/search/SearchForm';

export const metadata: Metadata = {
  title: 'Search formatterjson.org',
  description: 'Search tools, guides, and blog posts across formatterjson.org.',
  alternates: { canonical: 'https://formatterjson.org/search' },
};

export default function SearchPage() {
  return (
    <SEOPageLayout
      title="Search formatterjson.org"
      intro="Find tools, guides, and troubleshooting pages by keyword."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
    >
      <Suspense fallback={<p className="text-dt-text-muted">Loading search…</p>}>
        <SearchForm />
        <SearchResults />
      </Suspense>
    </SEOPageLayout>
  );
}
