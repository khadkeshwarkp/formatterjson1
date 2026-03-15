import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSONDecodeError: Expecting value Fix',
  description:
    'Solve Python JSONDecodeError: Expecting value by handling empty responses, BOM, malformed JSON, and quote errors.',
  alternates: { canonical: 'https://formatterjson.org/errors/jsondecodeerror-expecting-value' },
};

export default function JsonDecodeExpectingValuePage() {
  return (
    <SEOPageLayout
      title="JSONDecodeError: Expecting value"
      intro="This Python error usually means you are parsing an empty string or non-JSON content. Use this checklist to isolate the real source quickly."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'JSON Error Fixes', href: '/errors' },
        { label: 'JSONDecodeError: Expecting value' },
      ]}
    >
      <h2>Typical Causes</h2>
      <ul>
        <li>Empty response body or file read returned an empty string.</li>
        <li>HTML or text response instead of JSON.</li>
        <li>BOM or invisible control characters at the start.</li>
        <li>JSON string was double-encoded and not decoded first.</li>
      </ul>

      <h2>Debug Checklist</h2>
      <ol>
        <li>Print the raw string length and first 200 characters.</li>
        <li>Validate using <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>If it is escaped, decode with <Link href="/string-to-json">String to JSON</Link>.</li>
        <li>Format with <Link href="/json-formatter">JSON Formatter</Link>.</li>
      </ol>

      <h2>Python Example</h2>
      <pre><code>{`import json
raw = response.text
print(len(raw), raw[:200])

data = json.loads(raw)`}</code></pre>

      <h2>Recovery Strategy</h2>
      <p>
        Once the payload is valid JSON, compare against a known-good response using <Link href="/json-compare">JSON Compare</Link>
        to find drift in shape or types.
      </p>

      <h2>FAQ</h2>
      <h3>Why does this only happen on some records?</h3>
      <p>Some rows may be empty or contain stringified JSON. Check for null or empty inputs before parsing.</p>
      <h3>Should I ignore the error and return null?</h3>
      <p>Only if the upstream system guarantees optional data. Otherwise, fix the source payload.</p>
    </SEOPageLayout>
  );
}
