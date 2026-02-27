'use client';

import Link from 'next/link';
import { TOOL_MAP, TOOLS, type ToolMeta } from '@/lib/tools-registry';
import { CATEGORY_TO_HUB } from '@/lib/hubs';
import SiteFooter from '@/components/layout/SiteFooter';

const SITE_URL = 'https://formatterjson.org';

interface ToolSEOContentProps {
  toolId: string;
}

export default function ToolSEOContent({ toolId }: ToolSEOContentProps) {
  const tool = TOOL_MAP[toolId];
  if (!tool) return null;

  const related = tool.relatedTools
    .map((id) => TOOL_MAP[id])
    .filter(Boolean) as ToolMeta[];

  const hub = CATEGORY_TO_HUB[tool.category];

  // FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  // WebApplication structured data
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}${tool.route}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires a modern web browser with JavaScript enabled',
  };

  // Breadcrumb: Home > Category hub > Tool (3-level when hub exists)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...(hub
        ? [{ '@type': 'ListItem' as const, position: 2, name: hub.label, item: `${SITE_URL}${hub.path}` }]
        : []),
      {
        '@type': 'ListItem',
        position: hub ? 3 : 2,
        name: tool.name,
        item: `${SITE_URL}${tool.route}`,
      },
    ],
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-8 text-dt-text">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb nav: Home > Category > Tool */}
      <nav className="text-sm text-dt-text-muted mb-4">
        <Link href="/" className="text-dt-accent hover:underline">Home</Link>
        {hub && (
          <>
            <span className="mx-2">/</span>
            <Link href={hub.path} className="text-dt-accent hover:underline">{hub.label}</Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-dt-text">{tool.name}</span>
      </nav>

      {/* H1 */}
      <h1 className="text-2xl font-bold mb-4">{tool.seoH1}</h1>

      {/* What is */}
      <h2 className="text-xl font-semibold mb-3">What is {tool.name}?</h2>
      <p className="text-dt-text-muted mb-4 leading-relaxed">{tool.description}</p>
      <p className="text-dt-text-muted mb-6 leading-relaxed">{tool.seoExtra.longDescription}</p>

      {/* How to Use */}
      <h2 className="text-xl font-semibold mb-3">How to Use {tool.name}</h2>
      <ol className="list-decimal list-inside text-dt-text-muted mb-6 space-y-2 leading-relaxed">
        <li>Paste or type your input into the editor on the left panel.</li>
        <li>
          Press <kbd className="bg-dt-surface px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+Enter</kbd> or
          click <strong>Run</strong> to process your data instantly.
        </li>
        <li>View the result in the output panel on the right with full syntax highlighting.</li>
        <li>Use <strong>Copy</strong> or <strong>Download</strong> to export the result.</li>
        <li>Drag and drop <code className="bg-dt-surface px-1 rounded text-xs">.json</code> or <code className="bg-dt-surface px-1 rounded text-xs">.txt</code> files directly into the editor.</li>
        {toolId.startsWith('json') && (
          <li>
            Toggle <strong>Tree View</strong> for an interactive, collapsible view of the JSON structure.
          </li>
        )}
      </ol>

      {/* Example Input/Output */}
      <h2 className="text-xl font-semibold mb-3">Example</h2>
      <div className="mb-6 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-dt-text-muted mb-1">Input:</h3>
          <pre className="bg-dt-surface border border-dt-border rounded-lg p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all text-dt-text">
            {tool.sampleInput}
          </pre>
        </div>
        <div>
          <h3 className="text-sm font-medium text-dt-text-muted mb-1">Output:</h3>
          <pre className="bg-dt-surface border border-dt-border rounded-lg p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all text-dt-text">
            {tool.sampleOutput}
          </pre>
        </div>
      </div>

      {/* Use Cases */}
      <h2 className="text-xl font-semibold mb-3">Common Use Cases</h2>
      <ul className="list-disc list-inside text-dt-text-muted mb-6 space-y-2 leading-relaxed">
        {tool.seoExtra.useCases.map((uc, i) => (
          <li key={i}>{uc}</li>
        ))}
      </ul>

      {/* Comparison table */}
      {tool.seoExtra.comparisonRows.length > 0 && (
      <>
      <h2 className="text-xl font-semibold mb-3">{tool.seoExtra.comparisonTitle}</h2>
      <div className="mb-6 border border-dt-border rounded-lg overflow-hidden">
        {tool.seoExtra.comparisonRows.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 text-sm ${
              i % 2 === 0 ? 'bg-dt-surface/50' : 'bg-dt-bg'
            } ${i < tool.seoExtra.comparisonRows.length - 1 ? 'border-b border-dt-border' : ''}`}
          >
            <div className="px-3 py-2 font-medium text-dt-text">{row.label}</div>
            <div className="px-3 py-2 text-dt-text-muted">{row.left}</div>
            <div className="px-3 py-2 text-dt-text-muted">{row.right}</div>
          </div>
        ))}
      </div>
      </>
      )}

      {/* Common errors */}
      <h2 className="text-xl font-semibold mb-3">Common Errors</h2>
      <ul className="list-disc list-inside text-dt-text-muted mb-6 space-y-2 leading-relaxed">
        {tool.seoExtra.commonErrors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>

      {/* Why Use Our Tool */}
      <h2 className="text-xl font-semibold mb-3">Why Use Our {tool.name}?</h2>
      <ul className="list-disc list-inside text-dt-text-muted mb-6 space-y-2 leading-relaxed">
        <li><strong>100% client-side</strong> — your data never leaves your browser. No server processing, no data collection.</li>
        <li><strong>No sign-up required</strong> — start using the tool instantly with no registration or installation.</li>
        <li><strong>Keyboard shortcuts</strong> — press Ctrl+Enter to run, ? for shortcuts list, Ctrl+B to toggle sidebar.</li>
        <li><strong>Persistent state</strong> — your input is automatically saved across sessions using local storage.</li>
        <li><strong>IDE-style interface</strong> — Monaco Editor (the engine behind VS Code) with syntax highlighting and error detection.</li>
        <li><strong>Multi-format conversion</strong> — convert between JSON, XML, CSV, and YAML without switching tools.</li>
      </ul>

      {/* FAQ */}
      <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
      <div className="space-y-4 mb-8">
        {tool.faq.map((item, i) => (
          <div key={i}>
            <h3 className="font-medium text-dt-text">{item.q}</h3>
            <p className="text-dt-text-muted mt-1 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mb-8 p-5 bg-dt-surface border border-dt-border rounded-xl text-center">
        <h2 className="text-lg font-semibold mb-2">Try {tool.name} Now</h2>
        <p className="text-dt-text-muted text-sm mb-3">
          Paste your data into the editor above and press <kbd className="bg-dt-bg px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+Enter</kbd> to
          get instant results. Free, fast, and private.
        </p>
      </div>

      {/* Related tools */}
      {related.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Related Tools</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {related.map((rt) => (
              <Link
                key={rt.id}
                href={rt.route}
                className="inline-flex items-center gap-2 px-4 py-2 bg-dt-surface border border-dt-border rounded-lg text-sm text-dt-text-muted hover:text-dt-text hover:border-dt-accent transition-colors"
              >
                <span className="font-mono text-xs">{rt.icon}</span>
                {rt.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* All tools internal linking */}
      <h2 className="text-xl font-semibold mb-3">All Developer Tools</h2>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="text-sm text-dt-accent hover:underline">
          Home
        </Link>
        {hub && (
          <Link href={hub.path} className="text-sm text-dt-accent hover:underline">
            {hub.label}
          </Link>
        )}
        {TOOLS.filter((t) => t.id !== toolId).map((t) => (
          <Link
            key={t.id}
            href={t.route}
            className="text-sm text-dt-accent hover:underline"
          >
            {t.name}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Guides by Search Intent</h2>
      <div className="flex flex-wrap gap-3 mb-2">
        <Link href="/errors" className="text-sm text-dt-accent hover:underline">JSON Error Fixes</Link>
        <Link href="/languages" className="text-sm text-dt-accent hover:underline">Language-Specific Guides</Link>
        <Link href="/compare" className="text-sm text-dt-accent hover:underline">Tool Comparisons</Link>
        <Link href="/use-cases" className="text-sm text-dt-accent hover:underline">Developer Use Cases</Link>
        <Link href="/convert" className="text-sm text-dt-accent hover:underline">Conversion Playbooks</Link>
      </div>

      <SiteFooter />
    </section>
  );
}
