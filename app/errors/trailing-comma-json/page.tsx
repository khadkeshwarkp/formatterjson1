import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Trailing Comma JSON Error Guide',
  description:
    'Fix trailing comma JSON errors in objects and arrays with reliable validation and formatting steps for APIs and config files.',
  alternates: { canonical: 'https://formatterjson.org/errors/trailing-comma-json' },
};

export default function TrailingCommaJsonPage() {
  return (
    <SEOPageLayout
      title="Trailing Comma JSON Error"
      intro="Trailing commas are valid in many language literals but invalid in strict JSON. They often break CI config checks and API payload parsing."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'JSON Error Fixes', href: '/errors' },
        { label: 'Trailing Comma JSON Error' },
      ]}
    >
      <h2>Where It Happens</h2>
      <ul>
        <li>After the last property in an object.</li>
        <li>After the last item in an array.</li>
        <li>During manual edits or copied snippets from JS/TS files.</li>
      </ul>

      <h2>Fix Pattern</h2>
      <ol>
        <li>Paste into <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Remove final comma before <code>{'}'}</code> or <code>]</code>.</li>
        <li>Run <Link href="/json-formatter">Formatter</Link> for stable indentation.</li>
        <li>For version changes, verify with <Link href="/json-compare">JSON Compare</Link>.</li>
      </ol>

      <h2>Prevention Tip</h2>
      <p>
        Add pre-commit validation for config repositories. Use formatter + validator together for every payload copied between environments.
      </p>
    </SEOPageLayout>
  );
}
