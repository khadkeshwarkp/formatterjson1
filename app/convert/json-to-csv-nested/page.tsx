import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Convert Nested JSON to CSV',
  description:
    'Convert nested JSON to CSV safely using flattening strategy, stable path naming, and schema-consistent export rules.',
  alternates: { canonical: 'https://formatterjson.org/convert/json-to-csv-nested' },
};

export default function JsonToCsvNestedPage() {
  return (
    <SEOPageLayout
      title="Convert Nested JSON to CSV"
      intro="Nested JSON conversion fails when flattening rules are undefined. Use key-path based flattening and explicit array handling for stable exports."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Convert', href: '/convert' },
        { label: 'Nested JSON to CSV' },
      ]}
    >
      <h2>Conversion Rules That Work</h2>
      <ul>
        <li>Flatten nested keys using dot-path columns (example: <code>user.profile.age</code>).</li>
        <li>Decide array strategy: explode rows vs joined cell values.</li>
        <li>Normalize missing keys as blank/null for consistent headers.</li>
      </ul>

      <h2>Example</h2>
      <pre><code>{`// Input JSON
{
  "user": { "id": 7, "name": "Ava" },
  "tags": ["admin", "editor"]
}

// CSV headers
user.id,user.name,tags`}</code></pre>

      <h2>Workflow</h2>
      <ol>
        <li>Validate and format input first.</li>
        <li>Run <Link href="/json-to-csv">JSON to CSV</Link>.</li>
        <li>Round-trip check with <Link href="/csv-to-json">CSV to JSON</Link> for data loss detection.</li>
        <li>Use <Link href="/json-diff">JSON Diff</Link> between source and rehydrated output.</li>
      </ol>

      <h2>Common Pitfalls</h2>
      <ul>
        <li>Arrays of objects that should become multiple rows but are collapsed into a cell.</li>
        <li>Nested keys that disappear because headers are inferred from the first row only.</li>
        <li>Inconsistent types between rows (string vs number).</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Should I flatten all nested objects?</h3>
      <p>Flatten only the parts required by downstream tools. Deep flattening can make CSV hard to work with.</p>
      <h3>How do I preserve arrays?</h3>
      <p>Either explode arrays into multiple rows or join with a delimiter; pick one and stay consistent.</p>
    </SEOPageLayout>
  );
}
