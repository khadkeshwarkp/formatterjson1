import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'CSV to JSON Header Mapping Guide',
  description:
    'Map inconsistent CSV headers to clean JSON keys, normalize types, and validate output for API-safe integration.',
  alternates: { canonical: 'https://formatterjson.org/convert/csv-to-json-headers' },
};

export default function CsvToJsonHeadersPage() {
  return (
    <SEOPageLayout
      title="CSV to JSON with Header Mapping"
      intro="When CSV headers are inconsistent, map and normalize before conversion so downstream APIs receive clean keys and stable types."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Convert', href: '/convert' },
        { label: 'CSV to JSON Header Mapping' },
      ]}
    >
      <h2>Header Normalization Checklist</h2>
      <ul>
        <li>Trim whitespace and standardize case.</li>
        <li>Replace spaces/symbols with predictable separators.</li>
        <li>Map aliases to canonical keys (for example, <code>e-mail</code> to <code>email</code>).</li>
      </ul>

      <h2>Type Safety</h2>
      <p>
        Convert numeric and boolean columns explicitly, then validate with <Link href="/json-validator">JSON Validator</Link> before integration.
      </p>

      <h2>Recommended Tool Chain</h2>
      <ol>
        <li><Link href="/csv-to-json">CSV to JSON</Link></li>
        <li><Link href="/json-formatter">JSON Formatter</Link></li>
        <li><Link href="/json-compare">JSON Compare</Link> against expected template</li>
      </ol>
    </SEOPageLayout>
  );
}
