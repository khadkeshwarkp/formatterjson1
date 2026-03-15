import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Error Fixes Library',
  description:
    'Troubleshoot invalid JSON, unexpected token errors, trailing commas, and parser exceptions with fix-first developer guides.',
  alternates: { canonical: 'https://formatterjson.org/errors' },
};

const PAGES = [
  {
    href: '/errors/unexpected-token-json',
    title: 'Unexpected Token in JSON: Root Causes and Fixes',
    desc: 'Fix malformed payloads, HTML-as-JSON responses, and parse-at-position failures.',
  },
  {
    href: '/errors/trailing-comma-json',
    title: 'Trailing Comma JSON Error',
    desc: 'Resolve comma and bracket syntax issues across APIs and config files.',
  },
  {
    href: '/errors/jsondecodeerror-expecting-value',
    title: 'JSONDecodeError: Expecting value',
    desc: 'Debug Python decode failures caused by empty strings, BOM, or invalid quotes.',
  },
];

export default function ErrorsHubPage() {
  return (
    <SEOPageLayout
      title="JSON Error Fixes"
      intro="A dedicated error-first hub for debugging invalid JSON in real development workflows. Use these pages when parse errors block API integration, CI checks, or data conversion steps."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'JSON Error Fixes' }]}
    >
      <p>
        JSON parsing errors usually have repeatable root causes: invalid syntax, unexpected response types, or
        serialization drift between environments. This hub organizes fix-first workflows so you can move from failure
        to stable payloads quickly.
      </p>

      <h2>Start Here: 3-Step Triage</h2>
      <ol>
        <li>Validate payloads in the <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format with <Link href="/json-formatter">JSON Formatter</Link> to inspect structure.</li>
        <li>Compare failing vs expected payloads using <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <h2>Common Error Patterns</h2>
      <table>
        <thead>
          <tr>
            <th>Error message</th>
            <th>Likely root cause</th>
            <th>Fix path</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unexpected token &lt;</td>
            <td>HTML response, not JSON</td>
            <td>Inspect raw response, verify content type</td>
          </tr>
          <tr>
            <td>Trailing comma</td>
            <td>Invalid JSON syntax</td>
            <td>Remove last comma, re-validate</td>
          </tr>
          <tr>
            <td>Expecting value</td>
            <td>Empty string or whitespace payload</td>
            <td>Check upstream response or file read</td>
          </tr>
        </tbody>
      </table>

      <h2>Recommended Debug Workflow</h2>
      <p>
        Use an “inspect first, map later” workflow. Validate syntax before mapping into typed models, and only compare
        structure after the payload is valid JSON. This avoids false negatives caused by parsing failures.
      </p>
      <ul>
        <li>Validate syntax, then format.</li>
        <li>Use diff after you have a valid baseline.</li>
        <li>Run conversions only after schema integrity is confirmed.</li>
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

      <h2>Tool Chain Reference</h2>
      <ul>
        <li><Link href="/json-validator">JSON Validator</Link> for syntax checks and error localization.</li>
        <li><Link href="/json-formatter">JSON Formatter</Link> for readable inspection.</li>
        <li><Link href="/json-diff">JSON Diff</Link> to compare expected vs actual payloads.</li>
        <li><Link href="/string-to-json">String to JSON</Link> when payloads are double-encoded.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Why do valid-looking payloads still fail?</h3>
      <p>
        Hidden characters, BOMs, and HTML error responses are common. Always inspect the raw response and validate it.
      </p>
      <h3>Should I diff before or after formatting?</h3>
      <p>Format first. It makes differences easier to spot and avoids noise from minified payloads.</p>
    </SEOPageLayout>
  );
}
