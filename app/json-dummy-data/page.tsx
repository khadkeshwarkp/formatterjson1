import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'JSON Dummy Data (64KB–5MB) — Download Sample Files',
  description:
    'Download ready-to-use JSON dummy data files in multiple sizes. Includes formatted, minified, and invalid JSON samples for testing.',
  alternates: { canonical: 'https://formatterjson.org/json-dummy-data' },
};

const FORMATTED_FILES = [
  { label: '64KB.json', href: '/dummy-json/64KB.json' },
  { label: '128KB.json', href: '/dummy-json/128KB.json' },
  { label: '256KB.json', href: '/dummy-json/256KB.json' },
  { label: '512KB.json', href: '/dummy-json/512KB.json' },
  { label: '1MB.json', href: '/dummy-json/1024KB.json' },
  { label: '5MB.json', href: '/dummy-json/5120KB.json' },
];

const MINIFIED_FILES = [
  { label: '64KB-min.json', href: '/dummy-json/64KB-min.json' },
  { label: '128KB-min.json', href: '/dummy-json/128KB-min.json' },
  { label: '256KB-min.json', href: '/dummy-json/256KB-min.json' },
  { label: '512KB-min.json', href: '/dummy-json/512KB-min.json' },
  { label: '1MB-min.json', href: '/dummy-json/1024KB-min.json' },
  { label: '5MB-min.json', href: '/dummy-json/5120KB-min.json' },
];

const INVALID_FILES = [
  { label: 'missing-colon.json', href: '/dummy-json/missing-colon.json' },
  { label: 'unterminated.json', href: '/dummy-json/unterminated.json' },
  { label: 'binary-data.json', href: '/dummy-json/binary-data.json' },
];

function FileList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {items.map((file) => (
        <li key={file.href}>
          <a
            href={file.href}
            className="block rounded-xl border border-dt-border bg-dt-surface px-3 py-2 text-sm text-dt-text hover:border-dt-accent hover:text-dt-accent transition-colors"
            download
          >
            {file.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function JsonDummyDataPage() {
  return (
    <SEOPageLayout
      title="JSON Dummy Data (Download Sample Files)"
      intro="Download formatted, minified, and invalid JSON files in multiple sizes for testing JSON parsers, formatters, validators, and performance benchmarks."
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'JSON Dummy Data' }]}
    >
      <p>
        These files are designed for real-world testing: validating parsers, comparing performance across tools, and
        reproducing error handling paths. Use them with our{' '}
        <Link href="/json-formatter" className="text-dt-accent hover:underline">
          JSON Formatter
        </Link>
        ,{' '}
        <Link href="/json-validator" className="text-dt-accent hover:underline">
          JSON Validator
        </Link>
        , or{' '}
        <Link href="/json-diff" className="text-dt-accent hover:underline">
          JSON Diff
        </Link>{' '}
        to stress-test parsing and rendering.
      </p>

      <h2>Formatted JSON (Readable)</h2>
      <p>
        These files are pretty-printed with indentation and line breaks. Ideal for manual inspection and UI testing.
      </p>
      <FileList items={FORMATTED_FILES} />

      <h2 className="mt-8">Minified JSON (Compact)</h2>
      <p>
        These files are minified with no whitespace. Useful for simulating real production payloads and measuring
        parser speed.
      </p>
      <FileList items={MINIFIED_FILES} />

      <h2 className="mt-8">Invalid JSON (Error Testing)</h2>
      <p>
        Use these files to validate error handling, parser diagnostics, and recovery workflows.
      </p>
      <FileList items={INVALID_FILES} />

      <h2 className="mt-8">How to Use These Files</h2>
      <ol className="list-decimal ml-5 space-y-2 text-dt-text-muted">
        <li>Download a file size that matches your testing scenario.</li>
        <li>Open it in any of our tools (Formatter, Validator, Diff, Viewer).</li>
        <li>Measure performance and compare output across tools and languages.</li>
      </ol>

      <h2 className="mt-8">Recommended Tools</h2>
      <ul className="list-disc ml-5 space-y-2 text-dt-text-muted">
        <li>
          <Link href="/json-viewer" className="text-dt-accent hover:underline">
            JSON Viewer
          </Link>{' '}
          — inspect structure, collapse nodes, and validate nesting.
        </li>
        <li>
          <Link href="/json-formatter" className="text-dt-accent hover:underline">
            JSON Formatter
          </Link>{' '}
          — reformat minified files for readability.
        </li>
        <li>
          <Link href="/json-validator" className="text-dt-accent hover:underline">
            JSON Validator
          </Link>{' '}
          — test invalid JSON and get clear error locations.
        </li>
      </ul>

      <h2 className="mt-8">FAQ</h2>
      <h3>Which file should I start with?</h3>
      <p>
        If you’re testing UI or parser correctness, start with 64KB or 128KB. For performance testing, use 1MB or 5MB.
      </p>
      <h3>Are these files safe to use?</h3>
      <p>
        Yes. The data is synthetic and contains no personal information.
      </p>

      <div className="mt-10 rounded-2xl border border-dt-border bg-dt-surface p-5">
        <h3 className="text-lg font-semibold">Get Started with formatterjson.org</h3>
        <p className="text-dt-text-muted mt-1">
          Use the JSON Formatter or Validator to explore these files instantly in your browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/json-formatter" className="px-4 py-2 rounded-xl bg-dt-accent text-white text-sm font-semibold">
            Open JSON Formatter
          </Link>
          <Link href="/json-validator" className="px-4 py-2 rounded-xl border border-dt-border text-dt-text text-sm font-semibold">
            Open JSON Validator
          </Link>
        </div>
      </div>
    </SEOPageLayout>
  );
}
