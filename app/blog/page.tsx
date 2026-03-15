import type { Metadata } from 'next';
import Link from 'next/link';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Developer JSON Blog — formatterjson.org',
  description: 'Technical guides for JSON formatting, validation, diffing, and conversion workflows for developers and data teams.',
  alternates: { canonical: 'https://formatterjson.org/blog' },
};

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
        {BLOG_POSTS.map((post) => (
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
