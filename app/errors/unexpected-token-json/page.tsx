import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Unexpected Token JSON Error Fix',
  description:
    'Fix "Unexpected token" JSON parse errors caused by HTML responses, malformed payloads, or escaped string issues.',
  alternates: { canonical: 'https://formatterjson.org/errors/unexpected-token-json' },
};

export default function UnexpectedTokenJsonPage() {
  return (
    <SEOPageLayout
      title="Unexpected Token in JSON: How to Fix It"
      intro="This error usually means you are parsing non-JSON content as JSON, or your payload is malformed before parse time. Use this workflow to isolate source and fix quickly."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'JSON Error Fixes', href: '/errors' },
        { label: 'Unexpected Token in JSON' },
      ]}
    >
      <h2>Fast Diagnosis Checklist</h2>
      <ul>
        <li>Inspect raw response body before calling <code>JSON.parse</code> or <code>response.json()</code>.</li>
        <li>Confirm content-type is <code>application/json</code>.</li>
        <li>Run payload through <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Reformat payload in <Link href="/json-formatter">JSON Formatter</Link> to locate breakpoints.</li>
      </ul>

      <h2>Common Root Causes</h2>
      <ul>
        <li>Server returned HTML error page (<code>&lt;</code> token at position 0).</li>
        <li>Trailing commas or missing quotes in JSON body.</li>
        <li>Double-encoded escaped JSON string not decoded first.</li>
        <li>Unexpected BOM or invisible characters at payload start.</li>
      </ul>

      <h2>Recommended Workflow</h2>
      <p>
        Validate syntax first, then compare expected vs actual response shape using{' '}
        <Link href="/json-diff">JSON Diff</Link>. If the source is CSV/XML conversion output, normalize via{' '}
        <Link href="/convert">conversion guides</Link> before parsing.
      </p>
    </SEOPageLayout>
  );
}
