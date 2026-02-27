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
        Start by validating payloads in the <Link href="/json-validator">JSON Validator</Link>, then format with{' '}
        <Link href="/json-formatter">JSON Formatter</Link> to isolate structure issues.
      </p>
      <ul>
        {PAGES.map((page) => (
          <li key={page.href}>
            <h2>
              <Link href={page.href}>{page.title}</Link>
            </h2>
            <p>{page.desc}</p>
          </li>
        ))}
      </ul>
    </SEOPageLayout>
  );
}
