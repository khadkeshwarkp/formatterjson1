import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'API JSON Debugging Workflow',
  description:
    'A practical API debugging workflow for malformed JSON, schema drift, and response mismatch issues in production environments.',
  alternates: { canonical: 'https://formatterjson.org/use-cases/api-json-debugging' },
};

export default function ApiJsonDebuggingPage() {
  return (
    <SEOPageLayout
      title="API JSON Debugging Workflow"
      intro="A repeatable process for isolating payload errors fast, validating assumptions, and comparing failing responses against expected contracts."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Use Cases', href: '/use-cases' },
        { label: 'API JSON Debugging' },
      ]}
    >
      <h2>Step-by-Step</h2>
      <ol>
        <li>Capture raw response body and HTTP status.</li>
        <li>Run syntax checks in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Beautify with <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Compare to baseline using <Link href="/json-diff">JSON Diff</Link>.</li>
        <li>Generate typed models if needed (<Link href="/json-to-typescript">TS</Link>, <Link href="/json-to-csharp">C#</Link>).</li>
      </ol>

      <h2>Common Debug Outcomes</h2>
      <ul>
        <li>Unexpected token due to non-JSON response body.</li>
        <li>Type mismatch caused by upstream serialization changes.</li>
        <li>Field removal/addition breaking strict consumers.</li>
      </ul>

      <h2>Operational Tips</h2>
      <ul>
        <li>Log the raw response before parsing in production.</li>
        <li>Store a known-good payload for diff-based diagnostics.</li>
        <li>Fail fast on invalid JSON instead of silently ignoring it.</li>
      </ul>

      <p>
        For repeated incidents, publish this flow in team runbooks and CI validation checks.
      </p>

      <h2>FAQ</h2>
      <h3>Should I validate JSON in production?</h3>
      <p>Validate during debugging and in staging; in production, validate only on suspicious or high-risk inputs.</p>
      <h3>What if my API returns JSON strings instead of objects?</h3>
      <p>Decode with <Link href="/string-to-json">String to JSON</Link> and then parse as normal.</p>
    </SEOPageLayout>
  );
}
