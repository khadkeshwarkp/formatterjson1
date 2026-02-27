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
        These guides complement converters like <Link href="/json-to-typescript">JSON to TypeScript</Link>,{' '}
        <Link href="/json-to-python">JSON to Python</Link>, and{' '}
        <Link href="/json-to-csharp">JSON to C#</Link>.
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
