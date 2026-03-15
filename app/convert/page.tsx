import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Conversion Playbooks',
  description:
    'Conversion-focused guides for JSON to CSV, CSV to JSON, XML/YAML transforms, and nested structure edge cases.',
  alternates: { canonical: 'https://formatterjson.org/convert' },
};

const PAGES = [
  {
    href: '/convert/json-to-csv-nested',
    title: 'Convert Nested JSON to CSV',
    desc: 'Flatten nested objects and arrays without losing key-path meaning.',
  },
  {
    href: '/convert/csv-to-json-headers',
    title: 'CSV to JSON with Header Mapping',
    desc: 'Map inconsistent headers and normalize typed output for API usage.',
  },
];

export default function ConvertHubPage() {
  return (
    <SEOPageLayout
      title="JSON Conversion Playbooks"
      intro="Conversion edge-case guides for developers and analysts who need predictable, schema-safe transformations across structured formats."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Convert' }]}
    >
      <p>
        Conversions are where subtle data loss happens. A safe conversion plan always includes validation, normalization,
        and a round-trip check to confirm nothing critical was dropped.
      </p>

      <h2>Core Conversion Principles</h2>
      <ul>
        <li>Validate before converting to avoid carrying invalid structure forward.</li>
        <li>Normalize headers and key paths to keep consistent schemas.</li>
        <li>Round-trip check with the reverse converter to detect loss.</li>
      </ul>

      <h2>Common Conversion Paths</h2>
      <ul>
        <li><Link href="/json-to-csv">JSON to CSV</Link> for spreadsheets and analytics.</li>
        <li><Link href="/csv-to-json">CSV to JSON</Link> for API-ready data.</li>
        <li><Link href="/json-to-xml">JSON to XML</Link> and <Link href="/xml-to-json">XML to JSON</Link> for legacy systems.</li>
        <li><Link href="/json-to-yaml">JSON to YAML</Link> for config workflows.</li>
      </ul>

      <h2>Guides in This Hub</h2>
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

      <h2>Example: JSON to CSV with Nested Fields</h2>
      <pre><code>{`// Example input
{
  "user": { "id": 1, "name": "Ava" },
  "metrics": { "score": 91 }
}

// Flattened CSV headers
user.id,user.name,metrics.score`}</code></pre>

      <h2>Workflow Checklist</h2>
      <ol>
        <li>Validate JSON in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format in <Link href="/json-formatter">JSON Formatter</Link> for inspection.</li>
        <li>Convert using the target tool.</li>
        <li>Round-trip using the reverse converter.</li>
        <li>Compare results with <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <h2>FAQ</h2>
      <h3>Why do columns disappear after conversion?</h3>
      <p>CSV uses a fixed header set. If some objects lack a key, normalize missing keys first.</p>
      <h3>How do I convert arrays safely?</h3>
      <p>Decide whether to explode arrays into multiple rows or join them into a single cell value.</p>
    </SEOPageLayout>
  );
}
