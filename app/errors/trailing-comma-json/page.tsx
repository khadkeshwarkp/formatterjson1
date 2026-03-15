import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Trailing Comma JSON Error Fix',
  description:
    'Fix trailing comma errors in JSON by removing invalid commas and validating structure across objects and arrays.',
  alternates: { canonical: 'https://formatterjson.org/errors/trailing-comma-json' },
};

export default function TrailingCommaJsonPage() {
  return (
    <SEOPageLayout
      title="Trailing Comma JSON Error"
      intro="JSON does not allow trailing commas. This page shows how to detect them quickly and fix payloads from APIs, config files, and hand-edited JSON."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'JSON Error Fixes', href: '/errors' },
        { label: 'Trailing Comma JSON Error' },
      ]}
    >
      <h2>What a Trailing Comma Looks Like</h2>
      <pre><code>{`{
  "name": "Ava",
  "age": 30,
}`}</code></pre>
      <p>The comma after <code>30</code> is invalid in JSON.</p>

      <h2>Why It Happens</h2>
      <ul>
        <li>Manual edits in configs or sample payloads.</li>
        <li>Copy/paste from JavaScript object literals (which allow trailing commas).</li>
        <li>Templating logic that always appends commas.</li>
      </ul>

      <h2>Fix Workflow</h2>
      <ol>
        <li>Validate in <Link href="/json-validator">JSON Validator</Link> to locate the error position.</li>
        <li>Format with <Link href="/json-formatter">JSON Formatter</Link> to expose the line break.</li>
        <li>Remove trailing commas and re-validate.</li>
      </ol>

      <h2>Safe Example</h2>
      <pre><code>{`{
  "name": "Ava",
  "age": 30
}`}</code></pre>

      <h2>FAQ</h2>
      <h3>Why does JavaScript accept trailing commas but JSON does not?</h3>
      <p>JSON is a strict data interchange format; it does not allow trailing commas by specification.</p>
      <h3>Can the formatter auto-fix this?</h3>
      <p>No. The formatter requires valid JSON. Fix commas first, then format.</p>
    </SEOPageLayout>
  );
}
