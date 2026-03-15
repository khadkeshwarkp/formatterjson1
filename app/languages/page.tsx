import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'Language-Specific JSON Guides',
  description:
    'Programming language specific JSON formatting, parsing, validation, and debugging workflows for JavaScript, Python, and C#.',
  alternates: { canonical: 'https://formatterjson.org/languages' },
};

const PAGES = [
  {
    href: '/languages/javascript-json-tools',
    title: 'JavaScript JSON Debugging Workflows',
    desc: 'Fix fetch parsing errors, response.json() issues, and schema mismatches in JS apps.',
  },
  {
    href: '/languages/python-json-tools',
    title: 'Python JSON Workflows',
    desc: 'Handle JSONDecodeError, pretty print files, and validate payloads for automation.',
  },
  {
    href: '/languages/csharp-json-tools',
    title: 'C# JSON Workflows',
    desc: 'Resolve JsonException patterns and generate/validate classes from real payloads.',
  },
];

export default function LanguagesHubPage() {
  return (
    <SEOPageLayout
      title="Language-Specific JSON Guides"
      intro="Practical JSON troubleshooting and transformation playbooks by programming language, focused on real parser errors and API payload workflows."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Languages' }]}
    >
      <p>
        Language-specific JSON bugs often come from the same root causes, but the exceptions, stack traces, and fixes look
        different. Use these guides to map common parse errors to the tool workflow that resolves them fastest.
      </p>

      <h2>Common Failure Patterns Across Languages</h2>
      <ul>
        <li>Unexpected token errors from non-JSON responses.</li>
        <li>Double-encoded JSON strings (escaped payloads).</li>
        <li>Type mismatches between schema expectations and runtime values.</li>
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

      <h2>Recommended Tool Stack</h2>
      <ol>
        <li><Link href="/json-validator">JSON Validator</Link> to surface syntax errors.</li>
        <li><Link href="/json-formatter">JSON Formatter</Link> to inspect structure.</li>
        <li><Link href="/json-diff">JSON Diff</Link> to compare payload changes.</li>
        <li><Link href="/string-to-json">String to JSON</Link> for escaped payload decoding.</li>
      </ol>

      <h2>Code Generation Helpers</h2>
      <p>
        When you want typed models based on a real payload, use these converters to generate a safe starting point.
      </p>
      <ul>
        <li><Link href="/json-to-typescript">JSON to TypeScript</Link></li>
        <li><Link href="/json-to-python">JSON to Python</Link></li>
        <li><Link href="/json-to-csharp">JSON to C#</Link></li>
      </ul>

      <h2>FAQ</h2>
      <h3>Why does JSON.parse succeed in one environment but not another?</h3>
      <p>Often the response content type or payload differs between environments. Compare actual payloads.</p>
      <h3>Do I need to validate JSON if my code already parses it?</h3>
      <p>Validation surfaces malformed inputs early, before runtime exceptions cascade into broken flows.</p>
    </SEOPageLayout>
  );
}
