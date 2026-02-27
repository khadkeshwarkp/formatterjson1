import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSONDecodeError Expecting Value Fix',
  description:
    'Solve Python JSONDecodeError: Expecting value by handling empty responses, BOM, malformed JSON, and quote errors.',
  alternates: { canonical: 'https://formatterjson.org/errors/jsondecodeerror-expecting-value' },
};

export default function JsonDecodeErrorExpectingValuePage() {
  return (
    <SEOPageLayout
      title="Python JSONDecodeError: Expecting value"
      intro="This Python error usually indicates empty input, non-JSON text, or broken JSON syntax. The key is to validate raw input before decode."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'JSON Error Fixes', href: '/errors' },
        { label: 'JSONDecodeError: Expecting value' },
      ]}
    >
      <h2>Typical Causes</h2>
      <ul>
        <li>Empty string passed to <code>json.loads</code>.</li>
        <li>API returned HTML/plain text, not JSON.</li>
        <li>Single quotes or trailing commas.</li>
        <li>UTF-8 BOM at start of file.</li>
      </ul>

      <h2>Debug Workflow</h2>
      <ol>
        <li>Log raw payload length and first characters.</li>
        <li>Validate content in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Normalize structure with <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Use <Link href="/languages/python-json-tools">Python JSON workflow guide</Link> for code-level handling.</li>
      </ol>

      <h2>Related Tools</h2>
      <p>
        Use <Link href="/json-parser">JSON Parser</Link> for parse checks and <Link href="/json-diff">JSON Diff</Link> when comparing failing vs working payloads.
      </p>
    </SEOPageLayout>
  );
}
