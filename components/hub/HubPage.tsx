'use client';

import Link from 'next/link';
import WorkspaceShell from '@/components/layout/WorkspaceShell';
import SiteFooter from '@/components/layout/SiteFooter';
import { HUB_CONTENT } from '@/lib/hub-content';
import type { ToolMeta } from '@/lib/tools-registry';

const SITE_URL = 'https://formatterjson.org';

interface HubPageProps {
  slug: string;
  tools: ToolMeta[];
}

export default function HubPage({ slug, tools }: HubPageProps) {
  const content = HUB_CONTENT[slug];
  if (!content) return null;

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.title,
    description: content.description,
    url: `${SITE_URL}/${content.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.name,
        url: `${SITE_URL}${t.route}`,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: content.title, item: `${SITE_URL}/${content.slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full min-h-0 overflow-y-auto">
        <article className="max-w-3xl mx-auto px-6 py-10 text-dt-text">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

          <nav className="text-sm text-dt-text-muted mb-4">
            <Link href="/" className="text-dt-accent hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-dt-text">{content.title}</span>
          </nav>

          <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
          <p className="text-dt-text-muted text-lg leading-relaxed mb-8">{content.description}</p>

          {content.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{section.h2}</h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-dt-text-muted mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <h2 className="text-xl font-semibold mb-3">Tools in this category</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {tools.map((t) => (
              <Link
                key={t.id}
                href={t.route}
                className="inline-flex items-center gap-2 px-4 py-2 bg-dt-surface border border-dt-border rounded-lg text-sm text-dt-text-muted hover:text-dt-text hover:border-dt-accent transition-colors"
              >
                <span className="font-mono text-xs">{t.icon}</span>
                {t.name}
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-8">
            {content.faqs.map((item, i) => (
              <div key={i}>
                <h3 className="font-medium text-dt-text">{item.q}</h3>
                <p className="text-dt-text-muted mt-1 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-dt-border">
            <Link href="/" className="text-dt-accent hover:underline">← Back to Home</Link>
          </div>

          <SiteFooter />
        </article>
      </div>
    </WorkspaceShell>
  );
}
