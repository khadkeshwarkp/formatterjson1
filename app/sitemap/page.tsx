import Link from 'next/link';
import type { Metadata } from 'next';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import { TOOLS } from '@/lib/tools-registry';
import { SEO_HUBS } from '@/lib/seo-hubs';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'HTML Sitemap — formatterjson.org',
  description: 'Browse all tools, guides, and blog posts on formatterjson.org.',
  alternates: { canonical: 'https://formatterjson.org/sitemap' },
};

export default function HtmlSitemapPage() {
  const toolsByCategory = TOOLS.reduce<Record<string, typeof TOOLS>>((acc, tool) => {
    acc[tool.category] = acc[tool.category] ? [...acc[tool.category], tool] : [tool];
    return acc;
  }, {});

  return (
    <SEOPageLayout
      title="HTML Sitemap"
      intro="Browse all tools and guides from a single page."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]}
    >
      <h2>Tool Categories</h2>
      {Object.entries(toolsByCategory).map(([category, tools]) => (
        <section key={category} className="mb-6">
          <h3 className="text-lg font-semibold capitalize">{category} Tools</h3>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {tools.map((tool) => (
              <li key={tool.id}>
                <Link href={tool.route} className="text-dt-accent hover:underline">
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2>SEO Hubs</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SEO_HUBS.map((hub) => (
          <li key={hub.href}>
            <Link href={hub.href} className="text-dt-accent hover:underline">
              {hub.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-6">Blog Guides</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BLOG_POSTS.map((post) => (
          <li key={post.href}>
            <Link href={post.href} className="text-dt-accent hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-6">Company & Legal</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <li><Link href="/about" className="text-dt-accent hover:underline">About</Link></li>
        <li><Link href="/contact" className="text-dt-accent hover:underline">Contact</Link></li>
        <li><Link href="/privacy" className="text-dt-accent hover:underline">Privacy</Link></li>
        <li><Link href="/terms" className="text-dt-accent hover:underline">Terms</Link></li>
        <li><Link href="/disclaimer" className="text-dt-accent hover:underline">Disclaimer</Link></li>
      </ul>
    </SEOPageLayout>
  );
}
