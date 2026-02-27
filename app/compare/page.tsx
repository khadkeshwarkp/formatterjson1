import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Tool Comparisons',
  description:
    'Compare JSON tools and workflows: formatter vs validator, diff vs compare, and privacy/performance tradeoffs for developers.',
  alternates: { canonical: 'https://formatterjson.org/compare' },
};

const PAGES = [
  {
    href: '/compare/formatterjson-vs-jsonformatter-org',
    title: 'formatterjson.org vs jsonformatter.org',
    desc: 'Feature and workflow comparison for developer debugging and conversion tasks.',
  },
  {
    href: '/compare/json-diff-vs-json-compare',
    title: 'JSON Diff vs JSON Compare',
    desc: 'When to use structural diff versus broad side-by-side comparison workflows.',
  },
  {
    href: '/blog/json-pretty-print-vs-minify',
    title: 'Pretty Print vs Minify JSON',
    desc: 'Understand output tradeoffs for readability, bandwidth, and performance.',
  },
];

export default function CompareHubPage() {
  return (
    <SEOPageLayout
      title="JSON Tool Comparisons"
      intro="Comparison pages built for practical selection decisions: which tool to use, when to use it, and what tradeoffs matter in production workflows."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Compare' }]}
    >
      <p>
        Start with <Link href="/json-diff">JSON Diff</Link> for field-level change analysis and{' '}
        <Link href="/json-compare">JSON Compare</Link> for broad side-by-side review.
      </p>
      <ul>
        {PAGES.map((page) => (
          <li key={page.href}>
            <h2>
              <Link href={page.href}>{page.title}</Link>
            </h2>
            <p>{page.desc}</p>
          </li>
        ))}
      </ul>
    </SEOPageLayout>
  );
}
