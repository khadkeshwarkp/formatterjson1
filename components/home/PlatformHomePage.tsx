'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WorkspaceShell from '@/components/layout/WorkspaceShell';
import SiteFooter from '@/components/layout/SiteFooter';
import { HUBS } from '@/lib/hubs';
import { TOOL_MAP } from '@/lib/tools-registry';
import { SEO_HUBS } from '@/lib/seo-hubs';

const SITE_URL = 'https://formatterjson.org';

const POPULAR_TOOLS = [
  'json-formatter',
  'json-validator',
  'json-viewer',
  'json-diff',
  'json-to-java',
  'json-to-typescript',
  'json-to-python',
  'xml-formatter',
  'base64-encode',
  'jwt-decoder',
] as const;

const HOME_FAQS = [
  { q: 'What is formatterjson.org?', a: 'Formatterjson.org is a free online Developer Data Tools Platform. It offers JSON, XML, YAML, and encoding tools—formatters, validators, minifiers, and converters—that run entirely in your browser. No sign-up, no server uploads, and no data leaves your device.' },
  { q: 'Is my data safe?', a: 'Yes. Every tool runs 100% client-side using JavaScript in your browser. Your JSON, XML, YAML, or encoded data is never sent to our servers or any third party. You can verify this by opening your browser\'s Network tab while using any tool.' },
  { q: 'Do I need to create an account?', a: 'No. All tools are free to use without registration. Open a tool, paste or type your input, and get results instantly. Your preferences (such as theme and recent tools) are stored locally in your browser.' },
  { q: 'What tools are included?', a: 'The platform includes JSON formatter, validator, minifier, diff, and schema generator; JSON to XML, CSV, YAML, and language converters (TypeScript, Python, Java, Go, and more); XML and YAML formatters and validators; Base64 and URL encode/decode; JWT decoder; HTML formatter; and more.' },
  { q: 'Can I use these tools offline?', a: 'After loading the site once, many tools will work offline because the app is a static site. For full offline use, save the site for offline access in your browser. An internet connection is required for the first load.' },
  { q: 'How do I link to a specific tool?', a: 'Each tool has a unique URL (e.g. formatterjson.org/json-formatter). Share that URL to point others to the tool. Some tools support shareable links that include your input via an encoded query parameter.' },
];

export default function PlatformHomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Formatterjson — Free Online JSON & Developer Data Tools',
    description: 'Free online JSON, XML, YAML, and encoding tools. Format, validate, minify, and convert. 100% client-side, no sign-up.',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/json-formatter?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/json-formatter?q=${encodeURIComponent(q)}`);
  };

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full min-h-0 overflow-y-auto">
        <article className="max-w-4xl mx-auto px-6 py-12 text-dt-text">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

          {/* SECTION 1 — Hero */}
          <section className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Free Online JSON & Developer Data Tools</h1>
            <p className="text-dt-text-muted text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Format, validate, minify, and convert JSON, XML, YAML and more — instantly in your browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                href="/json-formatter"
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-dt-accent text-white hover:bg-dt-accent-hover transition-colors shadow-lg"
              >
                Start JSON Formatter
              </Link>
              <Link
                href="/json-tools"
                className="px-6 py-3 text-base font-medium rounded-xl border border-dt-border text-dt-text hover:border-dt-accent hover:text-dt-accent transition-colors"
              >
                Explore All Tools
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 text-base font-medium rounded-xl border border-dt-border text-dt-text hover:border-dt-accent hover:text-dt-accent transition-colors"
              >
                Read Blog
              </Link>
            </div>
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search tools…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-dt-border bg-dt-surface text-dt-text placeholder:text-dt-text-dim focus:outline-none focus:border-dt-accent text-base"
              />
            </form>
          </section>

          {/* SECTION 2 — Popular Tools Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Popular Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_TOOLS.map((id) => {
                const tool = TOOL_MAP[id];
                if (!tool) return null;
                return (
                  <Link
                    key={tool.id}
                    href={tool.route}
                    className="flex items-start gap-3 p-4 bg-dt-surface border border-dt-border rounded-xl hover:border-dt-accent transition-colors group"
                  >
                    <span className="text-xl font-mono shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-dt-bg text-dt-accent group-hover:bg-dt-accent/10">
                      {tool.icon}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-dt-text group-hover:text-dt-accent transition-colors">
                        {tool.name}
                      </span>
                      <p className="text-sm text-dt-text-muted mt-0.5 line-clamp-2">{tool.shortDescription}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SECTION 3 — Explore by Category */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HUBS.map((hub) => (
                <Link
                  key={hub.path}
                  href={hub.path}
                  className="p-5 bg-dt-surface border border-dt-border rounded-xl hover:border-dt-accent transition-colors flex flex-col"
                >
                  <span className="font-semibold text-dt-text text-lg">{hub.label}</span>
                  <p className="text-sm text-dt-text-muted mt-1">View all tools in this category</p>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 3.5 — SEO Hub Routes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Problem-Specific Learning Hubs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEO_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="p-5 bg-dt-surface border border-dt-border rounded-xl hover:border-dt-accent transition-colors"
                >
                  <span className="font-semibold text-dt-text text-lg">{hub.title}</span>
                  <p className="text-sm text-dt-text-muted mt-1">{hub.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 4 — Platform Overview (SEO block) */}
          <section className="mb-16 space-y-6">
            <h2 className="text-2xl font-bold">What This Platform Offers</h2>
            <p className="text-dt-text-muted leading-relaxed">
              Formatterjson.org is a structured developer data transformation platform. Instead of a single utility, you get a full ecosystem: <Link href="/json-formatter" className="text-dt-accent hover:underline">JSON Formatter</Link>, validators, minifiers, diff tools, and converters to XML, CSV, YAML, and multiple programming languages. For XML and YAML we provide formatters and validators; for encoding we offer Base64 and URL encode/decode; for security, a JWT decoder. Every tool is designed for the same workflow: paste input, get instant output, copy or download. No server round-trips and no account required.
            </p>
            <p className="text-dt-text-muted leading-relaxed">
              The platform is built for developers who need quick, reliable transformations without leaving the browser. Whether you&apos;re debugging an API response, converting a config file, or validating a payload, you&apos;ll find a dedicated tool. We keep existing URLs stable so bookmarks and search rankings stay intact, while adding category hub pages and new converters to make discovery and navigation easier.
            </p>

            <h2 className="text-xl font-semibold mt-8">Who Uses These Tools</h2>
            <p className="text-dt-text-muted leading-relaxed">
              Backend and frontend developers use the <Link href="/json-formatter" className="text-dt-accent hover:underline">JSON Formatter</Link> and <Link href="/json-validator" className="text-dt-accent hover:underline">Validator</Link> daily when debugging APIs. DevOps and SRE teams validate config files and compare environment configs with the <Link href="/json-diff" className="text-dt-accent hover:underline">JSON Diff</Link> tool. Data engineers convert JSON to CSV or vice versa. The <Link href="/json-to-typescript" className="text-dt-accent hover:underline">JSON to TypeScript</Link>, <Link href="/json-to-java" className="text-dt-accent hover:underline">JSON to Java</Link>, and <Link href="/json-to-python" className="text-dt-accent hover:underline">JSON to Python</Link> converters help when you need to generate types or classes from real data. All of these use cases are supported from one place.
            </p>

            <h2 className="text-xl font-semibold mt-8">Why Browser-Based Tools Are Safer</h2>
            <p className="text-dt-text-muted leading-relaxed">
              Server-based formatters require you to upload data. Here, parsing and transformation happen entirely in your browser. Sensitive configs, API payloads, and logs never touch our infrastructure. No data is ever sent to our servers or any third party. You can verify this by opening your browser&apos;s Network tab while using any tool. Instant results, no rate limits, no sign-up walls.
            </p>

            <h2 className="text-xl font-semibold mt-8">Data Privacy Statement</h2>
            <p className="text-dt-text-muted leading-relaxed">
              All data processing happens client-side using JavaScript. We do not collect, store, or transmit any data you enter into our tools. We use Google Analytics and AdSense, both subject to your consent preferences. See our <Link href="/privacy" className="text-dt-accent hover:underline">Privacy Policy</Link> for details.
            </p>

            <h2 className="text-xl font-semibold mt-8">Performance Benefits</h2>
            <p className="text-dt-text-muted leading-relaxed">
              The site is statically exported for fast load times. The interface uses the Monaco Editor (the engine behind VS Code) for syntax highlighting and keyboard shortcuts. Mobile-friendly layout with shallow crawl depth so users and search engines reach any tool within a few clicks from the homepage or category hubs.
            </p>
          </section>

          {/* SECTION 5 — FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {HOME_FAQS.map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-dt-text">{item.q}</h3>
                  <p className="text-dt-text-muted mt-1 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <SiteFooter />
        </article>
      </div>
    </WorkspaceShell>
  );
}
