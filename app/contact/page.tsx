import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Contact Us — DevTools Workspace',
  description: 'Contact formatterjson.org for bug reports, feature requests, partnerships, and technical feedback about our developer tools.',
  alternates: { canonical: 'https://formatterjson.org/contact' },
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us">
      <p>
        We appreciate feedback from developers, QA teams, and data engineers using formatterjson.org.
        If you found a bug, need a feature, or want to suggest a new tool, reach out directly.
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Primary Contact</h2>
      <p className="my-4">
        <strong className="text-dt-text">Email:</strong>{' '}
        <a href="mailto:stellarfusiondynamics@gmail.com" className="text-dt-accent hover:underline">
          stellarfusiondynamics@gmail.com
        </a>
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">What to Include in Bug Reports</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Tool name and page URL (for example: JSON Diff, CSV to JSON).</li>
        <li>What happened and what you expected.</li>
        <li>Browser and version (Chrome, Safari, Firefox, Edge).</li>
        <li>Sample input that reproduces the issue.</li>
        <li>Screenshot or screen recording if possible.</li>
      </ul>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Feature Requests</h2>
      <p>
        We actively improve formatting, validation, conversion, and diff workflows.
        Tell us the exact use case, expected input/output formats, and where it fits in your pipeline.
      </p>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Current Platform Highlights</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Light, Dark, and Black themes across all tools.</li>
        <li>Structured JSON Diff with filters, summary counts, and path navigation.</li>
        <li>Client-side processing for privacy (data stays in browser).</li>
        <li>New blog knowledge base for troubleshooting and workflows.</li>
      </ul>

      <h2 className="text-xl font-semibold text-dt-text mt-6">Useful Links</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><a href="/about" className="text-dt-accent hover:underline">About</a></li>
        <li><a href="/blog" className="text-dt-accent hover:underline">Blog</a></li>
        <li><a href="/privacy" className="text-dt-accent hover:underline">Privacy Policy</a></li>
        <li><a href="/terms" className="text-dt-accent hover:underline">Terms & Conditions</a></li>
        <li><a href="/disclaimer" className="text-dt-accent hover:underline">Disclaimer</a></li>
      </ul>
    </LegalPageLayout>
  );
}
