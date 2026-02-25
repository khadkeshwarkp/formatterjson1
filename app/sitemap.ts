import type { MetadataRoute } from 'next';

const SITE_URL = 'https://formatterjson.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const coreToolRoutes = [
    '/json-formatter',
    '/json-validator',
    '/json-minifier',
    '/json-to-xml',
    '/json-to-csv',
    '/json-to-yaml',
    '/json-viewer',
    '/json-parser',
    '/json-pretty-print',
    '/csv-to-json',
    '/json-diff',
    '/json-schema-generator',
    '/yaml-formatter',
    '/yaml-to-json',
    '/xml-formatter',
    '/xml-validator',
    '/xml-to-json',
    '/html-formatter',
    '/url-encode',
    '/url-decode',
    '/base64',
    '/base64-encode',
    '/base64-decode',
    '/jwt-decoder',
  ];

  const hubRoutes = ['/json-tools', '/xml-tools', '/yaml-tools', '/encoding-tools', '/utility-tools', '/converters'];

  const converterRoutes = [
    '/json-to-typescript',
    '/json-to-python',
    '/json-to-java',
    '/json-to-go',
    '/json-to-csharp',
    '/json-to-dart',
    '/json-to-rust',
    '/json-to-kotlin',
    '/json-to-swift',
    '/json-to-php',
  ];

  const utilityRoutes = [
    '/json-compare',
    '/json-sorter',
    '/json-escape',
    '/json-unescape',
    '/json-editor',
    '/json-to-html-table',
    '/json-to-sql',
    '/json-to-excel',
    '/json-to-tsv',
    '/json-to-one-line',
    '/lorem-ipsum',
    '/uuid-generator',
    '/random-json-generator',
    '/timestamp-converter',
    '/regex-tester',
    '/jwt-generator',
    '/hash-generator',
    '/color-converter',
    '/text-case-converter',
  ];

  const legalRoutes = ['/about', '/privacy', '/terms', '/disclaimer', '/contact'];
  const blogRoutes = [
    '/blog',
    '/blog/how-to-fix-invalid-json-errors',
    '/blog/json-pretty-print-vs-minify',
    '/blog/json-diff-explained',
    '/blog/convert-json-to-csv-and-back',
    '/blog/best-practices-validating-json-online',
  ];

  const lastMod = new Date('2026-02-21');

  return [
    { url: SITE_URL, lastModified: lastMod, changeFrequency: 'weekly' as const, priority: 1.0 },
    ...coreToolRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: route === '/json-formatter' ? 1.0 : 0.9,
    })),
    ...hubRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...converterRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...utilityRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...legalRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: route === '/about' || route === '/contact' ? 0.4 : 0.3,
    })),
    ...blogRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: route === '/blog' ? 0.75 : 0.7,
    })),
  ];
}
