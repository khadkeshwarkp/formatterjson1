import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';

export default function Footer() {
  return (
    <footer className="border-t border-dt-border bg-dt-sidebar mt-12">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          {/* Tools */}
          <div>
            <h3 className="font-semibold text-dt-text mb-3">Developer Tools</h3>
            <ul className="space-y-2">
              {TOOLS.map((t) => (
                <li key={t.id}>
                  <Link href={t.route} className="text-dt-text-muted hover:text-dt-text transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-dt-text mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-dt-text mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/string-to-json" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  String to JSON
                </Link>
              </li>
              <li>
                <Link href="/errors" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Error Fixes
                </Link>
              </li>
              <li>
                <Link href="/languages" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Language Guides
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Tool Comparisons
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/convert" className="text-dt-text-muted hover:text-dt-text transition-colors">
                  Conversion Playbooks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dt-border text-center text-xs text-dt-text-dim">
          © {new Date().getFullYear()} DevTools Workspace (formatterjson.org). All rights reserved. All processing is 100% client-side — your data never leaves your browser.
        </div>
      </div>
    </footer>
  );
}
