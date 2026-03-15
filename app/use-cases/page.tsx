import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Developer Use Cases',
  description:
    'Applied JSON workflows for API debugging, large file handling, payload inspection, and conversion tasks in developer teams.',
  alternates: { canonical: 'https://formatterjson.org/use-cases' },
};

const PAGES = [
  {
    href: '/use-cases/api-json-debugging',
    title: 'API JSON Debugging Workflow',
    desc: 'Step-by-step debugging pipeline for broken API responses and contract mismatches.',
  },
  {
    href: '/use-cases/large-json-files',
    title: 'Working with Large JSON Files',
    desc: 'Performance-oriented process for validating and diffing large payloads in browser tools.',
  },
];

export default function UseCasesHubPage() {
  return (
    <SEOPageLayout
      title="Developer JSON Use Cases"
      intro="Use-case driven guides focused on practical workflows instead of generic definitions. Ideal for API, QA, DevOps, and data operations teams."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Use Cases' }]}
    >
      <p>
        Most JSON issues show up in specific workflows, not in isolation. These use cases map common team scenarios to a
        stable tool chain so debugging steps are repeatable.
      </p>

      <h2>Who This Is For</h2>
      <ul>
        <li>Backend engineers debugging API payload drift.</li>
        <li>QA teams validating response contracts.</li>
        <li>Data teams converting JSON to tabular formats.</li>
      </ul>

      <h2>Use Cases in This Hub</h2>
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

      <h2>Recommended Workflow Pattern</h2>
      <ol>
        <li>Validate with <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format using <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Compare changes via <Link href="/json-diff">JSON Diff</Link>.</li>
        <li>Convert when needed under <Link href="/convert">Convert</Link>.</li>
      </ol>

      <h2>FAQ</h2>
      <h3>Do these workflows apply to data pipelines?</h3>
      <p>Yes. The same validate → format → diff pattern applies to ETL and data ingestion checks.</p>
      <h3>Should teams standardize on one tool stack?</h3>
      <p>Yes. Consistent tooling reduces time lost switching between inconsistent editors or formats.</p>
    </SEOPageLayout>
  );
}
