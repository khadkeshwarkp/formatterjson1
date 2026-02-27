import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Python JSON Workflows for Developers',
  description:
    'Fix JSONDecodeError, validate API payloads, and handle large JSON files with practical Python-focused debugging workflows.',
  alternates: { canonical: 'https://formatterjson.org/languages/python-json-tools' },
};

export default function PythonJsonToolsPage() {
  return (
    <SEOPageLayout
      title="Python JSON Workflows"
      intro="A focused workflow for Python developers dealing with decode failures, malformed files, and unstable API responses."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Languages', href: '/languages' },
        { label: 'Python JSON Tools' },
      ]}
    >
      <h2>Decode-Safe Pipeline</h2>
      <ol>
        <li>Check response/file is non-empty and UTF-8 clean.</li>
        <li>Validate syntax in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format in <Link href="/json-formatter">JSON Formatter</Link> to inspect nested structures.</li>
        <li>Use <Link href="/json-compare">JSON Compare</Link> between known-good and failing payloads.</li>
      </ol>

      <h2>Common Python Issues</h2>
      <ul>
        <li><code>JSONDecodeError: Expecting value</code> from empty strings.</li>
        <li>Unexpected BOM and invisible control characters.</li>
        <li>Type coercion mismatches after conversion from CSV/XML.</li>
      </ul>

      <p>
        Need generated models? Use <Link href="/json-to-python">JSON to Python</Link> for a quick starting structure.
      </p>
    </SEOPageLayout>
  );
}
