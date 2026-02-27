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
        Use direct tools like <Link href="/json-to-csv">JSON to CSV</Link>,{' '}
        <Link href="/csv-to-json">CSV to JSON</Link>, <Link href="/json-to-xml">JSON to XML</Link>, and{' '}
        <Link href="/json-to-yaml">JSON to YAML</Link>.
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
