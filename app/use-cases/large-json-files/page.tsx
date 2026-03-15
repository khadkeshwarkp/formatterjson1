import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Working with Large JSON Files',
  description:
    'Performance-oriented workflow for validating, searching, and comparing large JSON payloads without breaking developer productivity.',
  alternates: { canonical: 'https://formatterjson.org/use-cases/large-json-files' },
};

export default function LargeJsonFilesPage() {
  return (
    <SEOPageLayout
      title="Working with Large JSON Files"
      intro="Large payload debugging needs a different process: validate in phases, avoid expensive re-renders, and focus comparison scope by path."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Use Cases', href: '/use-cases' },
        { label: 'Large JSON Files' },
      ]}
    >
      <h2>Recommended Sequence</h2>
      <ol>
        <li>Validate syntax first with <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Use search to isolate specific keys/paths before full inspection.</li>
        <li>Run diffs on narrowed payload segments using <Link href="/json-diff">JSON Diff</Link>.</li>
        <li>Convert only required slices (<Link href="/json-to-csv">JSON to CSV</Link>) for analysis.</li>
      </ol>

      <h2>Performance Tips</h2>
      <ul>
        <li>Collapse unchanged diff regions.</li>
        <li>Avoid repeated full-tree expansion on huge objects.</li>
        <li>Use path-focused searches instead of broad regex where possible.</li>
      </ul>

      <h2>Chunking Strategy</h2>
      <p>
        If the browser struggles, split the payload by top-level keys and validate in chunks. You can also copy only the
        relevant section into the validator to locate syntax errors quickly.
      </p>

      <h2>FAQ</h2>
      <h3>How large is too large for a browser-based tool?</h3>
      <p>It depends on memory. If the editor slows down or crashes, slice the payload into smaller parts.</p>
      <h3>Should I minify large JSON before diffing?</h3>
      <p>No. Formatting and structure visibility are more valuable for debugging than raw size.</p>
    </SEOPageLayout>
  );
}
