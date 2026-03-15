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
        Use this hub when you are deciding which tool or workflow is best for a specific debugging task. The goal is to
        reduce tool switching by giving you a concrete decision framework.
      </p>

      <h2>Quick Decision Framework</h2>
      <ul>
        <li>Need path-level change classification? Use <Link href="/json-diff">JSON Diff</Link>.</li>
        <li>Need fast side-by-side visual review? Use <Link href="/json-compare">JSON Compare</Link>.</li>
        <li>Need readability vs size tradeoffs? Compare <Link href="/json-formatter">Formatter</Link> vs <Link href="/json-minifier">Minifier</Link>.</li>
      </ul>

      <h2>What Makes a Good Comparison</h2>
      <ol>
        <li>Ensure both inputs are valid JSON.</li>
        <li>Normalize formatting to eliminate whitespace noise.</li>
        <li>Decide whether you need semantic diff (keys/values) or visual diff (layout).</li>
      </ol>

      <h2>Comparisons in This Hub</h2>
      <ul>
        {PAGES.map((page) => (
          <li key={page.href}>
            <h3>
              <Link href={page.href}>{page.title}</Link>
            </h3>
            <p>{page.desc}</p>
          </li>
        ))}
      </ul>

      <h2>Example: Visual vs Structured Diff</h2>
      <pre><code>{`// Structured diff result (JSON Diff)
+ user.profile.age
- user.email
+ user.profile.timezone`}</code></pre>
      <p>
        Structured diffs produce actionable path-level changes. Visual diffs are faster for human review but less precise
        when you need machine-readable change sets.
      </p>

      <h2>FAQ</h2>
      <h3>Is JSON Diff the same as JSON Compare?</h3>
      <p>No. JSON Diff focuses on change classification and path-level output. JSON Compare is optimized for quick visual review.</p>
      <h3>Should I format before comparing?</h3>
      <p>Yes. Formatting removes whitespace noise and makes changes easier to see.</p>
      <h3>What if my payloads are large?</h3>
      <p>Use targeted search and compare only the relevant slices or paths first.</p>
    </SEOPageLayout>
  );
}
