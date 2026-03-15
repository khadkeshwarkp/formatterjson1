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
      intro="This error usually means you are parsing non-JSON content as JSON, or your payload is malformed before parse time. Use this workflow to isolate the source and fix quickly."
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

      <h2>Typical Root Causes</h2>
      <ul>
        <li>Server returned HTML error page (token <code>&lt;</code> at position 0).</li>
        <li>Trailing commas or missing quotes in JSON body.</li>
        <li>Double-encoded escaped JSON string not decoded first.</li>
        <li>Unexpected BOM or invisible characters at payload start.</li>
      </ul>

      <h2>Minimal Repro Example</h2>
      <pre><code>{`const raw = "<html>Not JSON</html>";
JSON.parse(raw); // Unexpected token < in JSON at position 0`}</code></pre>

      <h2>Fix Workflow</h2>
      <ol>
        <li>Log the raw response string (do not parse yet).</li>
        <li>Validate in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>If it is JSON but escaped, decode with <Link href="/string-to-json">String to JSON</Link>.</li>
        <li>Compare expected vs actual payloads using <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <h2>Language Snippets</h2>
      <h3>JavaScript</h3>
      <pre><code>{`const text = await response.text();
console.log(text.slice(0, 200));
const data = JSON.parse(text);`}</code></pre>

      <h3>Python</h3>
      <pre><code>{`import json
raw = response.text
json.loads(raw)`}</code></pre>

      <h2>FAQ</h2>
      <h3>Why does this happen only in production?</h3>
      <p>Production responses often include error pages, CDNs, or auth redirects that do not exist in staging.</p>
      <h3>Should I auto-retry parsing?</h3>
      <p>No. Inspect the raw response first. Retrying without fixing the source usually hides the real issue.</p>
    </SEOPageLayout>
  );
}
