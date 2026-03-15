import { TOOLS } from '@/lib/tools-registry';
import { SEO_HUBS } from '@/lib/seo-hubs';
import { BLOG_POSTS } from '@/lib/blog-posts';

export interface SearchItem {
  title: string;
  href: string;
  description: string;
  category: string;
}

export const SEARCH_INDEX: SearchItem[] = [
  ...TOOLS.map((tool) => ({
    title: tool.name,
    href: tool.route,
    description: tool.shortDescription || tool.description,
    category: 'Tool',
  })),
  ...SEO_HUBS.map((hub) => ({
    title: hub.title,
    href: hub.href,
    description: hub.description,
    category: 'Guide Hub',
  })),
  ...BLOG_POSTS.map((post) => ({
    title: post.title,
    href: post.href,
    description: post.desc,
    category: 'Blog',
  })),
  {
    title: 'About formatterjson.org',
    href: '/about',
    description: 'About the team, mission, and platform highlights.',
    category: 'Company',
  },
  {
    title: 'Contact formatterjson.org',
    href: '/contact',
    description: 'Reach out for bug reports, feature requests, or partnerships.',
    category: 'Company',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'How we handle cookies, analytics, and data privacy.',
    category: 'Legal',
  },
  {
    title: 'Terms & Conditions',
    href: '/terms',
    description: 'Platform terms for using formatterjson.org.',
    category: 'Legal',
  },
  {
    title: 'Disclaimer',
    href: '/disclaimer',
    description: 'Legal disclaimer for using the tools and guides.',
    category: 'Legal',
  },
  {
    title: 'HTML Sitemap',
    href: '/sitemap',
    description: 'Full list of pages for fast navigation.',
    category: 'Navigation',
  },
];
