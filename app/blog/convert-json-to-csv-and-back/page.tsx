import type { Metadata } from 'next';
import Link from 'next/link';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';

export const metadata: Metadata = {
  title: 'Convert JSON to CSV (and Back) — Practical Guide',
  description:
    'Learn json to csv online and csv to json converter workflows with examples, edge cases, and practical data transformation tips.',
  alternates: { canonical: 'https://formatterjson.org/blog/convert-json-to-csv-and-back' },
  keywords: ['json to csv online', 'csv to json converter', 'json to csv examples'],
  openGraph: {
    title: 'Convert JSON to CSV (and Back)',
    description: 'Practical conversion guide for developers and analysts handling structured data.',
    url: 'https://formatterjson.org/blog/convert-json-to-csv-and-back',
    type: 'article',
  },
};

export default function Page() {
  return (
    <BlogArticleLayout
      title="Convert JSON to CSV (and Back)"
      intro="JSON and CSV conversions are common in analytics, imports/exports, and reporting pipelines. This guide shows reliable conversion patterns, pitfalls with nested structures, and how to validate output before downstream use."
    >
      <h2>When to Use JSON vs CSV</h2>
      <ul>
        <li><strong>JSON:</strong> hierarchical, API-native, supports nested objects/arrays.</li>
        <li><strong>CSV:</strong> tabular, spreadsheet-friendly, ideal for BI workflows.</li>
      </ul>
      <p>
        Use <Link href="/json-to-csv">JSON to CSV</Link> when handing data to analysts, and{' '}
        <Link href="/csv-to-json">CSV to JSON</Link> when moving data back into services.
      </p>

      <h2>Core Mapping Rules</h2>
      <table>
        <thead>
          <tr>
            <th>JSON concept</th>
            <th>CSV mapping</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Object keys</td>
            <td>Columns</td>
            <td>Missing keys produce blank values</td>
          </tr>
          <tr>
            <td>Array of objects</td>
            <td>Rows</td>
            <td>Inconsistent row schema</td>
          </tr>
          <tr>
            <td>Nested object</td>
            <td>Flatten or stringify</td>
            <td>Loss of structure</td>
          </tr>
        </tbody>
      </table>

      <h2>JSON to CSV Example</h2>
      <pre><code>{`[
  {"id":1,"name":"Ava","city":"Austin"},
  {"id":2,"name":"Liam","city":"Denver"}
]`}</code></pre>
      <p>Output:</p>
      <pre><code>{`id,name,city
1,Ava,Austin
2,Liam,Denver`}</code></pre>

      <h2>CSV to JSON Example</h2>
      <pre><code>{`id,name,city
1,Ava,Austin
2,Liam,Denver`}</code></pre>
      <p>Output:</p>
      <pre><code>{`[
  {"id":"1","name":"Ava","city":"Austin"},
  {"id":"2","name":"Liam","city":"Denver"}
]`}</code></pre>

      <h2>Code Snippets by Language</h2>
      <h3>JavaScript</h3>
      <pre><code>{`const rows = data.map(r => [r.id, r.name, r.city].join(','));
const csv = ['id,name,city', ...rows].join('\n');`}</code></pre>

      <h3>Python</h3>
      <pre><code>{`import csv, json
with open('input.json') as f:
    data = json.load(f)
with open('out.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['id','name','city'])
    w.writeheader(); w.writerows(data)`}</code></pre>

      <h3>C#</h3>
      <pre><code>{`// Use CsvHelper + System.Text.Json for robust conversion in production`}</code></pre>

      <h3>Java</h3>
      <pre><code>{`// Use Jackson for JSON + OpenCSV for CSV serialization`}</code></pre>

      <h2>Real Use Cases</h2>
      <ul>
        <li>Export API response to spreadsheet for stakeholder review.</li>
        <li>Import CSV from operations team into backend service.</li>
        <li>Data migration where source is CSV and target contract is JSON.</li>
      </ul>

      <h2>Validation Checklist After Conversion</h2>
      <ol>
        <li>Validate JSON output using <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Reformat with <Link href="/json-formatter">JSON Formatter</Link> for visual inspection.</li>
        <li>Compare pre/post records with <Link href="/json-diff">JSON Diff</Link>.</li>
        <li>Watch for type coercion (numbers become strings in CSV pipelines).</li>
      </ol>

      <h2>Screenshot Recommendations</h2>
      <ul>
        <li>JSON array input and CSV output side-by-side.</li>
        <li>CSV input converted back to JSON and validated.</li>
        <li>Diff screenshot showing changed types after roundtrip conversion.</li>
      </ul>

      <h2>Pro Tips</h2>
      <ul>
        <li>Flatten nested JSON before CSV export to preserve tabular clarity.</li>
        <li>Document column-to-key mappings in ETL jobs.</li>
        <li>Normalize null/empty values before conversion.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Can I convert nested JSON directly to CSV?</h3>
      <p>Yes, but nested data should be flattened or stringified to avoid ambiguity.</p>

      <h3>Why are numbers quoted after CSV to JSON conversion?</h3>
      <p>CSV has no native typing; parsers often default to strings unless you cast values explicitly.</p>

      <h3>What tool should I use for fast conversion?</h3>
      <p>
        Use <Link href="/json-to-csv">JSON to CSV</Link> and{' '}
        <Link href="/csv-to-json">CSV to JSON</Link> on formatterjson.org.
      </p>

      <h2>Get Started with formatterjson.org</h2>
      <p>
        Convert with <Link href="/json-to-csv">JSON to CSV</Link> and <Link href="/csv-to-json">CSV to JSON</Link>,
        then validate using <Link href="/json-validator">JSON Validator</Link>.
      </p>
    </BlogArticleLayout>
  );
}
