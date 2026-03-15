import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JavaScript JSON Debugging Guide',
  description:
    'Practical JavaScript JSON workflows for fetch parsing, schema mismatches, and API response troubleshooting.',
  alternates: { canonical: 'https://formatterjson.org/languages/javascript-json-tools' },
};

export default function JavaScriptJsonToolsPage() {
  return (
    <SEOPageLayout
      title="JavaScript JSON Debugging Workflows"
      intro="Use this when response.json() fails, payloads change across environments, or nested structures break rendering."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Languages', href: '/languages' },
        { label: 'JavaScript JSON Tools' },
      ]}
    >
      <h2>Core Flow</h2>
      <ol>
        <li>Capture raw response text before parsing.</li>
        <li>Validate with <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Normalize using <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Compare payload variants via <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <h2>High-Impact Checks</h2>
      <ul>
        <li>Content-Type mismatch (HTML returned instead of JSON).</li>
        <li>Unexpected token from escaped payload strings.</li>
        <li>Type mismatch between expected interfaces and runtime data.</li>
      </ul>

      <h2>Minimal Debug Snippet</h2>
      <pre><code>{`const text = await response.text();
console.log(text.slice(0, 200));
const data = JSON.parse(text);`}</code></pre>

      <h2>Typed Workflows</h2>
      <p>
        For typed outputs, convert to <Link href="/json-to-typescript">TypeScript definitions</Link> and lock interface expectations
        before updating downstream code.
      </p>

      <h2>FAQ</h2>
      <h3>Why does response.json() throw in production?</h3>
      <p>Most commonly due to auth redirects or CDN error pages returning HTML instead of JSON.</p>
      <h3>How do I handle double-encoded JSON?</h3>
      <p>Decode using <Link href="/string-to-json">String to JSON</Link>, then parse the result.</p>
    </SEOPageLayout>
  );
}
