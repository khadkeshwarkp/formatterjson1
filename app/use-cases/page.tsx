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
        Pair these workflows with <Link href="/json-validator">validation</Link>,{' '}
        <Link href="/json-diff">diffing</Link>, and conversion tools under{' '}
        <Link href="/convert">Convert</Link>.
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
