import Link from 'next/link';
import Footer from '@/components/layout/Footer';

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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-dt-text hover:text-dt-accent transition-colors">
            formatterjson.org
          </Link>
          <nav className="flex items-center gap-4 text-sm text-dt-text-muted">
            <Link href="/blog" className="hover:text-dt-text transition-colors">Blog</Link>
            <Link href="/json-formatter" className="text-dt-accent hover:underline">JSON Formatter</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sm text-dt-text-dim mb-3">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/blog" className="hover:underline">Blog</Link>
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-dt-text-muted mb-8 max-w-4xl">{intro}</p>

        <article className="blog-content max-w-none">
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
}
