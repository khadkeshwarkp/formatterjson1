import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Diff vs JSON Compare',
  description:
    'Understand the practical difference between JSON Diff and JSON Compare tools and when each approach is best for debugging.',
  alternates: { canonical: 'https://formatterjson.org/compare/json-diff-vs-json-compare' },
};

export default function JsonDiffVsJsonComparePage() {
  return (
    <SEOPageLayout
      title="JSON Diff vs JSON Compare"
      intro="Both tools inspect differences, but they serve different debugging workflows. Choose based on precision, speed, and output format needs."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Compare', href: '/compare' },
        { label: 'JSON Diff vs JSON Compare' },
      ]}
    >
      <h2>Use JSON Diff When</h2>
      <ul>
        <li>You need path-level change classification (added/removed/modified).</li>
        <li>You need filters and change navigation.</li>
        <li>You are tracking regression from one payload version to another.</li>
      </ul>

      <h2>Use JSON Compare When</h2>
      <ul>
        <li>You need broad side-by-side review quickly.</li>
        <li>You are doing exploratory inspection without strict categories.</li>
        <li>You need a lightweight manual comparison pass.</li>
      </ul>

      <h2>Example Difference Output</h2>
      <pre><code>{`// JSON Diff output (structured)
+ user.profile.age
- user.email
~ user.status`}</code></pre>

      <h2>Workflow Guidance</h2>
      <ol>
        <li>Validate both payloads in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format in <Link href="/json-formatter">JSON Formatter</Link> for readability.</li>
        <li>Run <Link href="/json-diff">JSON Diff</Link> for precise change tracking.</li>
      </ol>

      <p>
        Open <Link href="/json-diff">JSON Diff</Link> for structured workflows and{' '}
        <Link href="/json-compare">JSON Compare</Link> for fast visual review.
      </p>
    </SEOPageLayout>
  );
}
