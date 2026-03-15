import Link from 'next/link';

/** Compact footer with legal links — used on homepage, tool pages, hub pages. */
export default function SiteFooter() {
  return (
    <footer className="mt-10 pt-8 border-t border-dt-border text-sm text-dt-text-muted">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/about" className="hover:text-dt-accent transition-colors">About</Link>
        <Link href="/contact" className="hover:text-dt-accent transition-colors">Contact</Link>
        <Link href="/blog" className="hover:text-dt-accent transition-colors">Blog</Link>
        <Link href="/search/" className="hover:text-dt-accent transition-colors">Search</Link>
        <Link href="/sitemap" className="hover:text-dt-accent transition-colors">Sitemap</Link>
        <Link href="/string-to-json" className="hover:text-dt-accent transition-colors">String to JSON</Link>
        <Link href="/errors" className="hover:text-dt-accent transition-colors">Errors</Link>
        <Link href="/languages" className="hover:text-dt-accent transition-colors">Languages</Link>
        <Link href="/compare" className="hover:text-dt-accent transition-colors">Compare</Link>
        <Link href="/use-cases" className="hover:text-dt-accent transition-colors">Use Cases</Link>
        <Link href="/convert" className="hover:text-dt-accent transition-colors">Convert</Link>
        <Link href="/privacy" className="hover:text-dt-accent transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-dt-accent transition-colors">Terms</Link>
        <Link href="/disclaimer" className="hover:text-dt-accent transition-colors">Disclaimer</Link>
      </div>
      <p className="mt-3 text-center text-xs text-dt-text-dim">
        © {new Date().getFullYear()} formatterjson.org · 100% client-side · your data never leaves your browser
      </p>
    </footer>
  );
}
