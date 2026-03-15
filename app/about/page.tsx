import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: 'About Us — DevTools Workspace',
  description: 'About formatterjson.org: privacy-first JSON developer tools for formatting, validation, conversion, and structured diff workflows.',
  alternates: { canonical: 'https://formatterjson.org/about' },
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About formatterjson.org">
      <p>
        formatterjson.org is a developer-focused toolkit for JSON and structured data workflows.
        We help teams format, validate, compare, and convert JSON, XML, YAML, CSV, and encoded text quickly without installing software.
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Mission</h2>
      <p>
        Build practical, fast, and privacy-first tools for real engineering work: API debugging, payload validation,
        migration checks, and format conversions.
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Team & Experience</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Developer-first focus with daily use of JSON tooling in real API and data workflows.</li>
        <li>Emphasis on clear UX, predictable output, and debugging-focused features.</li>
        <li>Maintained as a fast, static, privacy-first platform with consistent UI across tools.</li>
      </ul>

      <h2 className="text-xl font-semibold text-dt-text mt-6">What’s on the Platform</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>JSON Formatter / Validator / Minifier</strong> for daily API and config workflows.</li>
        <li><strong>JSON Diff / Compare</strong> with structured change categories and path navigation.</li>
        <li><strong>Converters</strong> (JSON ↔ CSV/XML/YAML and JSON → language types).</li>
        <li><strong>Encoding & utility tools</strong> like Base64, URL encode/decode, JWT tools, regex, and hashing.</li>
      </ul>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Recent Improvements</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Global Light / Dark / Black theme system.</li>
        <li>Refined editor UX with improved readability and layout behavior.</li>
        <li>Professional JSON Diff interface with filters and navigation.</li>
        <li>New technical blog content for troubleshooting and best practices.</li>
      </ul>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Privacy and Processing</h2>
      <p>
        Data is processed in your browser. We do not store your payloads on our servers.
        For analytics and ads, controls are governed by consent settings and documented in the{' '}
        <a href="/privacy" className="text-dt-accent hover:underline">Privacy Policy</a>.
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Resources</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><a href="/json-formatter" className="text-dt-accent hover:underline">Start with JSON Formatter</a></li>
        <li><a href="/json-diff" className="text-dt-accent hover:underline">Open JSON Diff</a></li>
        <li><a href="/blog" className="text-dt-accent hover:underline">Read the Blog</a></li>
        <li><a href="/contact" className="text-dt-accent hover:underline">Contact Us</a></li>
      </ul>
    </LegalPageLayout>
  );
}
