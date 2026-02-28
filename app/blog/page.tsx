import type { Metadata } from 'next';
import Link from 'next/link';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';

export const metadata: Metadata = {
  title: 'Developer JSON Blog — formatterjson.org',
  description: 'Technical guides for JSON formatting, validation, diffing, and conversion workflows for developers and data teams.',
  alternates: { canonical: 'https://formatterjson.org/blog' },
};

const POSTS = [
  {
    href: '/blog/how-to-fix-invalid-json-errors',
    title: 'How to Fix Invalid JSON Errors',
    desc: 'Troubleshoot parse errors, unexpected tokens, and broken payloads in real-world API workflows.',
  },
  {
    href: '/blog/json-pretty-print-vs-minify',
    title: 'JSON Pretty Print vs Minify: What\'s the Difference?',
    desc: 'When to beautify JSON and when to minify it for transport, debugging, and production.',
  },
  {
    href: '/blog/json-diff-explained',
    title: 'Deep Guide: JSON Diff Explained',
    desc: 'Understand additions, deletions, modifications, and type mismatches when comparing JSON.',
  },
  {
    href: '/blog/convert-json-to-csv-and-back',
    title: 'Convert JSON to CSV (and Back)',
    desc: 'Practical conversion patterns, edge cases, and examples for developer and analyst workflows.',
  },
  {
    href: '/blog/best-practices-validating-json-online',
    title: 'Best Practices for Validating JSON Online',
    desc: 'Validate large files safely and fix JSON syntax with fast repeatable debugging workflows.',
  },
];

export default function BlogIndexPage() {
  return (
    <BlogArticleLayout
      title="Developer JSON Guides"
      intro="Technical tutorials for JSON formatting, validation, diffing, and conversion. Built for real-world debugging and API workflows."
    >
      <h2>Explore by Search Intent</h2>
      <ul>
        <li><Link href="/errors">JSON Error Fixes</Link> for parse/debugging issues.</li>
        <li><Link href="/languages">Language-Specific Guides</Link> for JS/Python/C# workflows.</li>
        <li><Link href="/use-cases">Use Cases</Link> for API debugging and large file handling.</li>
        <li><Link href="/convert">Conversion Playbooks</Link> for nested and edge-case transforms.</li>
        <li><Link href="/compare">Comparison Pages</Link> for tool selection decisions.</li>
        <li><Link href="/string-to-json">String to JSON Tool</Link> for escaped payload parsing and serialization workflows.</li>
      </ul>

      <h2>Latest Guides</h2>
      <ul>
        {POSTS.map((post) => (
          <li key={post.href}>
            <h2>
              <Link href={post.href}>{post.title}</Link>
            </h2>
            <p>{post.desc}</p>
          </li>
        ))}
      </ul>
    </BlogArticleLayout>
  );
}
