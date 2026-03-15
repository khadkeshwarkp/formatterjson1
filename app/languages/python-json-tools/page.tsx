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

      <h2>Practical Snippet</h2>
      <pre><code>{`import json
raw = response.text
print(raw[:200])

data = json.loads(raw)`}</code></pre>

      <p>
        Need generated models? Use <Link href="/json-to-python">JSON to Python</Link> for a quick starting structure.
      </p>

      <h2>FAQ</h2>
      <h3>How do I handle BOM issues?</h3>
      <p>Strip BOM before parsing or decode with utf-8-sig in Python.</p>
      <h3>Why does parsing fail only on some inputs?</h3>
      <p>Inconsistent API responses or empty rows in files are common sources.</p>
    </SEOPageLayout>
  );
}
