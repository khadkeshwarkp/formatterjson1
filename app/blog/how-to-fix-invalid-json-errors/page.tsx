import type { Metadata } from 'next';
import Link from 'next/link';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';

export const metadata: Metadata = {
  title: 'How to Fix Invalid JSON Errors (Parse Error Guide)',
  description:
    'Fix invalid JSON error, json parse error, and unexpected token JSON issues with practical debugging steps and code examples.',
  alternates: { canonical: 'https://formatterjson.org/blog/how-to-fix-invalid-json-errors' },
  keywords: ['invalid JSON error', 'json parse error', 'unexpected token JSON'],
  openGraph: {
    title: 'How to Fix Invalid JSON Errors',
    description: 'Troubleshoot invalid JSON errors fast with examples in JavaScript, Python, C#, and Java.',
    url: 'https://formatterjson.org/blog/how-to-fix-invalid-json-errors',
    type: 'article',
  },
};

export default function Page() {
  return (
    <BlogArticleLayout
      title="How to Fix Invalid JSON Errors"
      intro="If your API call fails with a JSON parse error, this guide gives you a repeatable way to diagnose and fix it. We cover common error patterns, language-specific exceptions, and practical validation workflows used in production teams."
    >
      <h2>What an Invalid JSON Error Actually Means</h2>
      <p>
        An <strong>invalid JSON error</strong> means the payload is not compliant with strict JSON syntax. Typical parser messages include
        <code>Unexpected token</code>, <code>Unexpected end of JSON input</code>, and <code>Expecting property name enclosed in double quotes</code>.
        JSON parsers are strict by design: a single trailing comma or unescaped quote can break the entire payload.
      </p>
      <p>
        Start with validation first, then formatting. Use{' '}
        <Link href="/json-validator">JSON Validator</Link> to get line/column errors and{' '}
        <Link href="/json-formatter">JSON Formatter</Link> to make the structure readable.
      </p>

      <h2>Most Common JSON Parse Error Patterns</h2>
      <h3>Unexpected token JSON</h3>
      <pre><code>{`{"name": "Ava", age: 30}`}</code></pre>
      <p>Problem: key <code>age</code> is unquoted.</p>

      <h3>Trailing comma</h3>
      <pre><code>{`{
  "name": "Ava",
  "age": 30,
}`}</code></pre>
      <p>Problem: trailing comma after last field.</p>

      <h3>Single quotes or unescaped content</h3>
      <pre><code>{`{'name':'Ava'}`}</code></pre>
      <p>Problem: JSON requires double quotes for keys and strings.</p>

      <h3>Unexpected token &lt; in JSON</h3>
      <p>
        This usually means your endpoint returned HTML (often an error page or auth redirect) while your code expected JSON.
        Inspect the raw response body before parsing.
      </p>

      <h2>5-Minute Troubleshooting Workflow</h2>
      <ol>
        <li>Copy raw payload (before any object mapping).</li>
        <li>Validate in <Link href="/json-validator">JSON Validator</Link>.</li>
        <li>Fix exact line/column issue.</li>
        <li>Reformat in <Link href="/json-formatter">JSON Formatter</Link>.</li>
        <li>Compare old vs fixed payload in <Link href="/json-diff">JSON Diff</Link>.</li>
      </ol>

      <table>
        <thead>
          <tr>
            <th>Error message</th>
            <th>Likely cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unexpected token {'}'}</td>
            <td>Trailing comma</td>
            <td>Remove final comma</td>
          </tr>
          <tr>
            <td>Unexpected token &lt;</td>
            <td>HTML response, not JSON</td>
            <td>Inspect response body and content type</td>
          </tr>
          <tr>
            <td>Expecting property name</td>
            <td>Unquoted key</td>
            <td>Use double-quoted keys</td>
          </tr>
        </tbody>
      </table>

      <h2>Language-Specific Examples</h2>
      <h3>JavaScript</h3>
      <pre><code>{`try {
  const data = JSON.parse(raw);
} catch (err) {
  console.error('JSON parse error:', err.message);
}`}</code></pre>

      <h3>Python</h3>
      <pre><code>{`import json

try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    print(e.msg, e.lineno, e.colno)`}</code></pre>

      <h3>C#</h3>
      <pre><code>{`using System.Text.Json;

try {
  var doc = JsonDocument.Parse(raw);
} catch (JsonException ex) {
  Console.WriteLine(ex.Message);
}`}</code></pre>

      <h3>Java</h3>
      <pre><code>{`ObjectMapper mapper = new ObjectMapper();
try {
  Object value = mapper.readValue(raw, Object.class);
} catch (Exception e) {
  System.out.println(e.getMessage());
}`}</code></pre>

      <h2>Real Use Cases from Developer Teams</h2>
      <ul>
        <li><strong>API integration debugging:</strong> broken payloads between staging and production.</li>
        <li><strong>Config deployments:</strong> malformed JSON in env-specific config files.</li>
        <li><strong>ETL pipelines:</strong> partial records containing invalid escape characters.</li>
        <li><strong>Webhook processing:</strong> unexpected HTML or text response from upstream systems.</li>
      </ul>

      <h2>Screenshot Recommendations</h2>
      <ul>
        <li>Validator view showing line-numbered parse error.</li>
        <li>Before/after formatted payload screenshot.</li>
        <li>JSON Diff screenshot comparing failing and fixed payload.</li>
      </ul>

      <h2>Pro Tips</h2>
      <ul>
        <li>Always log raw responses when parse fails.</li>
        <li>Validate first, map to domain models second.</li>
        <li>Treat "Unexpected token &lt;" as a response-type bug, not JSON syntax bug.</li>
        <li>Use schema checks after syntax validation for robust pipelines.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>How do I fix invalid JSON quickly?</h3>
      <p>Paste into a validator, fix the exact line/column error, then re-run parse.</p>

      <h3>Why does JSON.parse fail while payload looks correct?</h3>
      <p>Often hidden issues: trailing commas, bad escaping, or non-JSON response content.</p>

      <h3>Can I validate large JSON online?</h3>
      <p>Yes. Use <Link href="/json-validator">JSON Validator</Link> and then <Link href="/json-formatter">JSON Formatter</Link> for readable inspection.</p>

      <h2>Get Started with formatterjson.org</h2>
      <p>
        Validate malformed payloads with <Link href="/json-validator">JSON Validator</Link>, format for readability with{' '}
        <Link href="/json-formatter">JSON Formatter</Link>, and compare payload versions with{' '}
        <Link href="/json-diff">JSON Diff</Link>.
      </p>
    </BlogArticleLayout>
  );
}
