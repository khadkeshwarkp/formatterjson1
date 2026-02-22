import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';
import Footer from './Footer';

export default function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-dt-bg text-dt-text">
      {/* Header */}
      <header className="border-b border-dt-border shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-dt-text hover:text-dt-accent transition-colors">
            DevTools Workspace
          </Link>
          <nav className="flex items-center gap-4 text-sm text-dt-text-muted">
            {TOOLS.slice(0, 3).map((t) => (
              <Link key={t.id} href={t.route} className="hover:text-dt-text transition-colors hidden sm:inline">
                {t.name}
              </Link>
            ))}
            <Link href="/json-formatter" className="text-dt-accent hover:underline">
              All Tools →
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 min-h-0">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="prose-dt text-dt-text-muted leading-relaxed space-y-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
