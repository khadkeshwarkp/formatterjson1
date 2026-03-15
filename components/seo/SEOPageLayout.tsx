import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { SEO_HUBS } from '@/lib/seo-hubs';
import SiteSearchBar from '@/components/seo/SiteSearchBar';
import AuthorCard from '@/components/seo/AuthorCard';

interface SEOPageLayoutProps {
  title: string;
  intro: string;
  breadcrumb: { label: string; href?: string }[];
  children: React.ReactNode;
}

export default function SEOPageLayout({ title, intro, breadcrumb, children }: SEOPageLayoutProps) {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-dt-bg text-dt-text">
      <header className="border-b border-dt-border bg-dt-card/80 backdrop-blur-dt-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Link href="/" className="text-lg font-semibold text-dt-text hover:text-dt-accent transition-colors">
            formatterjson.org
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <nav className="flex items-center gap-4 text-sm text-dt-text-muted">
              <Link href="/blog" className="hover:text-dt-text transition-colors">Blog</Link>
              <Link href="/errors" className="hover:text-dt-text transition-colors">Errors</Link>
              <Link href="/convert" className="hover:text-dt-text transition-colors">Convert</Link>
              <Link href="/search/" className="hover:text-dt-text transition-colors">Search</Link>
            </nav>
            <SiteSearchBar />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-dt-text-dim mb-4">
          {breadcrumb.map((item, idx) => (
            <span key={`${item.label}-${idx}`}>
              {idx > 0 ? ' / ' : ''}
              {item.href ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-dt-text">{item.label}</span>
              )}
            </span>
          ))}
        </p>

        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-dt-text-muted mb-8 max-w-4xl">{intro}</p>

        <article className="blog-content max-w-none">{children}</article>
        <AuthorCard updated="March 16, 2026" />

        <section className="mt-10 border-t border-dt-border pt-6">
          <h2 className="text-xl font-semibold mb-4">Explore More SEO Hubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEO_HUBS.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className="block rounded-xl border border-dt-border bg-dt-surface p-4 hover:border-dt-accent transition-colors"
              >
                <h3 className="font-semibold text-dt-text">{hub.title}</h3>
                <p className="text-sm text-dt-text-muted mt-1">{hub.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
