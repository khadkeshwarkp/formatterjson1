import type { Metadata } from 'next';
import Link from 'next/link';
import SEOPageLayout from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = {
  title: 'C# JSON Parsing and Validation Guide',
  description:
    'Resolve C# JsonException issues, validate payloads, and compare API response drift using practical .NET-focused JSON workflows.',
  alternates: { canonical: 'https://formatterjson.org/languages/csharp-json-tools' },
};

export default function CSharpJsonToolsPage() {
  return (
    <SEOPageLayout
      title="C# JSON Workflows"
      intro="Use this guide when System.Text.Json parsing fails or payload shapes drift across environments in .NET services."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Languages', href: '/languages' },
        { label: 'C# JSON Tools' },
      ]}
    >
      <h2>Production Debug Flow</h2>
      <ol>
        <li>Capture raw payload from logs or network traces.</li>
        <li>Run syntax check in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Format for inspection with <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Diff failing vs expected payload in <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <h2>Common C# Failure Patterns</h2>
      <ul>
        <li><code>JsonException: The JSON value could not be converted</code>.</li>
        <li>Numeric/string type mismatch for strict model properties.</li>
        <li>Missing required fields after upstream version updates.</li>
      </ul>

      <h2>Minimal Snippet</h2>
      <pre><code>{`using System.Text.Json;

try {
  var doc = JsonDocument.Parse(raw);
} catch (JsonException ex) {
  Console.WriteLine(ex.Message);
}`}</code></pre>

      <p>
        Generate starter model definitions with <Link href="/json-to-csharp">JSON to C#</Link>, then harden with explicit validation.
      </p>

      <h2>FAQ</h2>
      <h3>Why do null fields break my deserialization?</h3>
      <p>Check for strict nullable annotations or custom converters that reject null values.</p>
      <h3>Should I switch to Newtonsoft.Json?</h3>
      <p>System.Text.Json is fine for most cases. Use Newtonsoft.Json only if you need specific converters.</p>
    </SEOPageLayout>
  );
}
