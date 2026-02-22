import type { Metadata } from 'next';
import PlatformHomePage from '@/components/home/PlatformHomePage';

const SITE_URL = 'https://formatterjson.org';

export const metadata: Metadata = {
  title: 'Free Online JSON & Developer Data Tools',
  description:
    'Format, validate, minify, and convert JSON, XML, YAML instantly in your browser. JSON to TypeScript, Python, Java, Go. Base64, JWT decoder. 100% client-side, no sign-up.',
  keywords: [
    'JSON formatter',
    'developer data tools',
    'JSON validator',
    'JSON to XML',
    'YAML formatter',
    'XML formatter',
    'Base64 encode',
    'free online tools',
  ],
  openGraph: {
    title: 'Free Online JSON & Developer Data Tools Platform',
    description: 'Format, validate, convert JSON, XML, YAML. Encoding and security tools. Free, fast, 100% browser-based. No sign-up.',
    url: SITE_URL,
  },
  twitter: {
    title: 'Free Online JSON & Developer Data Tools Platform',
    description: 'Format, validate, convert JSON, XML, YAML. Free, fast, 100% browser-based. No sign-up.',
  },
  alternates: { canonical: SITE_URL },
};

/** Platform homepage: unique content, no redirect, no duplicate of /json-formatter. */
export default function HomePage() {
  return <PlatformHomePage />;
}
