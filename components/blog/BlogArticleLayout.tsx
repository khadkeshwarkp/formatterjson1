import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import SiteSearchBar from '@/components/seo/SiteSearchBar';
import AuthorCard from '@/components/seo/AuthorCard';

export default function BlogArticleLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-dt-bg text-dt-text">
      <header className="border-b border-dt-border bg-dt-card/80 backdrop-blur-dt-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Link href="/" className="text-lg font-semibold text-dt-text hover:text-dt-accent transition-colors">
            formatterjson.org
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <nav className="flex items-center gap-4 text-sm text-dt-text-muted">
              <Link href="/blog" className="hover:text-dt-text transition-colors">Blog</Link>
              <Link href="/json-formatter" className="text-dt-accent hover:underline">JSON Formatter</Link>
              <Link href="/search/" className="hover:text-dt-text transition-colors">Search</Link>
            </nav>
            <SiteSearchBar />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sm text-dt-text-dim mb-3">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/blog" className="hover:underline">Blog</Link>
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-dt-text-muted mb-8 max-w-4xl">{intro}</p>

        <article className="blog-content max-w-none">{children}</article>
        <AuthorCard updated="March 16, 2026" />
      </main>

      <Footer />
    </div>
  );
}
