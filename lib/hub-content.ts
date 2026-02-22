export interface HubSection {
  h2: string;
  paragraphs: string[];
}

export interface HubContent {
  title: string;
  description: string;
  metaDescription: string;
  faqs: { q: string; a: string }[];
  /** Slug for this hub (e.g. json-tools) */
  slug: string;
  sections: HubSection[];
}

export const HUB_CONTENT: Record<string, HubContent> = {
  'json-tools': {
    slug: 'json-tools',
    title: 'JSON Tools',
    description: 'Format, validate, minify, convert, and work with JSON data.',
    metaDescription: 'Free online JSON tools: formatter, validator, minifier, diff, schema generator, JSON to XML/CSV/YAML. 100% client-side.',
    faqs: [
      { q: 'What JSON tools are available?', a: 'The JSON tools category includes a formatter (beautify/pretty-print), validator (syntax check), minifier (compress), diff (compare two JSONs), schema generator, viewer, parser, and converters to XML, CSV, and YAML. All run in your browser.' },
      { q: 'Do I need valid JSON to use the formatter?', a: 'Yes. The formatter expects valid JSON. If your data has errors, use the JSON Validator first to find and fix them, then format or minify as needed.' },
      { q: 'Can I convert JSON to other formats?', a: 'Yes. We provide JSON to XML, JSON to CSV, and JSON to YAML. There are also converters that generate code in languages like TypeScript, Python, and Java from JSON structures.' },
      { q: 'Is my JSON data sent to a server?', a: 'No. All JSON tools run entirely in your browser. Your data never leaves your device. You can confirm this by checking the Network tab in your browser developer tools.' },
      { q: 'Where do I start if I have messy JSON?', a: 'Paste it into the JSON Validator to see any syntax errors, then use the JSON Formatter to beautify it. For comparing two versions, use JSON Diff.' },
    ],
    sections: [
      {
        h2: 'Why a dedicated JSON tools ecosystem?',
        paragraphs: [
          'JSON has become the default format for APIs, configs, and data exchange. Developers often need to format minified responses, validate payloads before sending, compare two versions of a document, or convert JSON to XML, CSV, or YAML for downstream systems. A single “formatter” is not enough—you need a coherent set of tools that share the same privacy guarantees and workflow.',
          'This hub groups every JSON-related tool on the platform. Whether you start from the JSON Formatter, the Validator, or the Diff tool, you can move to related actions without leaving the ecosystem. All tools use the same editor and shortcuts: paste input, run (or rely on auto-run), and copy or download the result. No account, no server uploads, and no rate limits.',
        ],
      },
      {
        h2: 'From validation to conversion',
        paragraphs: [
          'A typical workflow starts with validation. Paste API response or config into the JSON Validator to get clear error messages and line numbers. Once the JSON is valid, use the Formatter to beautify it or the Minifier to compress it for production. The JSON Diff tool compares two JSON documents side by side and highlights added, removed, and changed keys—ideal for config or API changes.',
          'When you need to feed data into systems that expect other formats, use the converters: JSON to XML, JSON to CSV, and JSON to YAML. For type-safe code generation, the JSON Schema Generator produces a schema from sample JSON, and dedicated converters generate TypeScript, Python, Java, Go, and other language definitions from your structure. Every step runs in the browser, so sensitive data never leaves your machine.',
        ],
      },
      {
        h2: 'Who uses these tools?',
        paragraphs: [
          'Backend and frontend developers use the formatter and validator daily when debugging APIs or inspecting payloads. DevOps and SRE teams validate config files and compare environment configs with the diff tool. Data engineers convert JSON to CSV or vice versa for pipelines and spreadsheets. The schema generator and code converters help when you need to document or generate types from real data. All of these use cases are supported from one place, with consistent behavior and no sign-up.',
        ],
      },
    ],
  },
  'xml-tools': {
    slug: 'xml-tools',
    title: 'XML Tools',
    description: 'Format, validate, and convert XML.',
    metaDescription: 'Free online XML tools: formatter, validator, XML to JSON converter. 100% client-side, no sign-up.',
    faqs: [
      { q: 'What XML tools are available?', a: 'The XML tools category includes an XML Formatter (beautify and indent), XML Validator (check well-formedness and syntax), and XML to JSON converter. All run in your browser.' },
      { q: 'Can I convert XML to JSON?', a: 'Yes. Use the XML to JSON tool to transform well-formed XML into JSON. Useful for API integration or when working with systems that consume JSON.' },
      { q: 'Is my XML data sent to a server?', a: 'No. All XML processing happens in your browser. No data is uploaded or stored on our servers.' },
      { q: 'What if my XML is invalid?', a: 'Use the XML Validator to get detailed error messages and line information. Fix the issues, then use the formatter or converter as needed.' },
      { q: 'Do you support XML namespaces?', a: 'The tools handle standard XML. For complex namespaces or custom DTDs, validation is focused on well-formedness and basic structure.' },
    ],
    sections: [
      {
        h2: 'The role of XML in modern workflows',
        paragraphs: [
          'XML remains common in enterprise systems, SOAP APIs, document formats, and configuration. Even when your primary format is JSON, you may receive XML from legacy services or need to produce XML for a partner. This hub centralizes the tools you need: format messy XML for readability, validate it before sending or parsing, and convert it to JSON when you need to work with it in a JSON-first stack.',
          'All three tools—Formatter, Validator, and XML to JSON—run entirely in your browser. There is no server round-trip, so sensitive documents and payloads stay on your device. The same editor and keyboard shortcuts used across the platform apply here, so switching between JSON and XML tools feels consistent.',
        ],
      },
      {
        h2: 'When to use each tool',
        paragraphs: [
          'Use the XML Formatter when you have a single-line or poorly indented XML file and need to inspect or edit it. The Validator is the first stop when integration fails or you need to check well-formedness before sending data. The XML to JSON converter is useful when you are migrating to a JSON API, building a bridge between XML and JSON services, or need to process XML data with JSON-oriented libraries. Together they cover the main operations developers perform on XML without leaving the browser.',
        ],
      },
    ],
  },
  'yaml-tools': {
    slug: 'yaml-tools',
    title: 'YAML Tools',
    description: 'Format YAML and convert between YAML and JSON.',
    metaDescription: 'Free online YAML tools: YAML formatter, YAML to JSON converter. 100% client-side.',
    faqs: [
      { q: 'What YAML tools are available?', a: 'The YAML tools category includes a YAML Formatter (beautify and indent) and YAML to JSON converter. For the reverse, use the JSON to YAML tool in the JSON tools section.' },
      { q: 'Can I convert YAML to JSON?', a: 'Yes. Paste your YAML into the YAML to JSON tool to get valid JSON. Useful for config migration or APIs that require JSON.' },
      { q: 'Is my YAML data sent to a server?', a: 'No. All YAML processing runs in your browser. Your data stays on your device.' },
      { q: 'What YAML version is supported?', a: 'The tools use a widely compatible YAML 1.2 parser. Most common YAML features, including anchors and aliases, are supported.' },
      { q: 'Where is JSON to YAML?', a: 'JSON to YAML is available from the JSON Formatter and other JSON tools via the convert bar, and as a dedicated tool under the JSON/converters ecosystem.' },
    ],
    sections: [
      {
        h2: 'YAML in config and DevOps',
        paragraphs: [
          'YAML is the format of choice for Kubernetes manifests, CI/CD configs, Docker Compose, and many application config files. It is human-friendly but sensitive to indentation and structure. This hub brings together the YAML Formatter and YAML to JSON so you can clean up configs, validate structure indirectly via JSON, and convert when you need to feed YAML data into JSON-based tools or APIs.',
          'Both tools run in your browser. Paste YAML, format it for readability or convert it to JSON in one step. No uploads and no account. The formatter helps when you inherit poorly formatted YAML or need to standardize indentation; the converter is useful for config migration, API payloads, or when your stack expects JSON.',
        ],
      },
      {
        h2: 'Format and convert without leaving the browser',
        paragraphs: [
          'The YAML Formatter takes minified or inconsistent YAML and outputs consistently indented, readable YAML. The YAML to JSON tool produces valid JSON from the same YAML—handy when you are moving from a YAML-based config to a JSON API or when you need to process the structure programmatically as JSON. For the reverse direction (JSON to YAML), use the dedicated converter in the JSON tools or the convert bar on any JSON tool. Together these cover the main YAML workflows developers need on a daily basis.',
        ],
      },
    ],
  },
  'encoding-tools': {
    slug: 'encoding-tools',
    title: 'Encoding Tools',
    description: 'Base64 and URL encoding and decoding.',
    metaDescription: 'Free online encoding tools: Base64 encode/decode, URL encode/decode. 100% client-side, no sign-up.',
    faqs: [
      { q: 'What encoding tools are available?', a: 'The encoding tools category includes Base64 encode, Base64 decode, and a combined Base64 tool that toggles mode, plus URL encode and URL decode. All run in your browser.' },
      { q: 'When should I use Base64?', a: 'Base64 is used to represent binary data as text—e.g. embedding images in HTML/JSON, or sending binary in APIs. Use the encoder for text or binary input and the decoder to get back the original.' },
      { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) replaces special characters in strings so they can be safely used in URLs or form data. Use URL Encode to encode and URL Decode to decode.' },
      { q: 'Is my data sent to a server?', a: 'No. All encoding and decoding happens in your browser. Nothing is uploaded or stored.' },
      { q: 'Can I encode binary files?', a: 'The Base64 tool accepts text input. For binary files, use a local tool or paste Base64 output from another source; the decoder will decode it in the browser.' },
    ],
    sections: [
      {
        h2: 'Why encoding matters for developers',
        paragraphs: [
          'Base64 and URL encoding are used everywhere: auth headers, data URIs, query strings, and API payloads. Base64 turns binary data into safe ASCII text so it can be embedded in JSON, XML, or HTML. URL encoding (percent-encoding) makes sure special characters in query parameters or form data do not break URLs or parsing. This hub groups the encoding tools in one place so you can encode or decode without hunting through the app.',
          'All tools run in your browser. Paste text or Base64 string, choose encode or decode, and get the result instantly. No server involvement means no logging or storage of your data—important when dealing with tokens or sensitive strings.',
        ],
      },
      {
        h2: 'Base64 vs URL encoding',
        paragraphs: [
          'Base64 is for representing binary or arbitrary byte sequences as text—e.g. image data in JSON, certificates, or encoded payloads. The Base64 tool lets you encode text or decode Base64 back to readable form. URL encoding is for strings that go in URLs or form data: spaces become %20, ampersands %26, and so on. Use URL Encode before putting a string in a query parameter and URL Decode when you receive or need to parse an encoded value. Both are reversible and deterministic; the tools here give you a fast, client-side way to perform either operation.',
        ],
      },
    ],
  },
  'utility-tools': {
    slug: 'utility-tools',
    title: 'Utility Tools',
    description: 'Lorem Ipsum, UUID, Random JSON, Timestamp, Regex, JWT, Hash, Color, Text Case.',
    metaDescription: 'Free online utility tools: Lorem Ipsum generator, UUID generator, Random JSON, Timestamp converter, Regex tester, JWT generator, Hash (MD5/SHA-256), Color converter, Text case converter. 100% client-side.',
    faqs: [
      { q: 'What utility tools are available?', a: 'Lorem Ipsum Generator, UUID Generator, Random JSON Generator, Timestamp Converter, Regex Tester, JWT Generator, Hash Generator (MD5/SHA-256), Color Converter, and Text Case Converter. All run in your browser.' },
      { q: 'Is my data sent to a server?', a: 'No. All utility tools run entirely in your browser. No data is uploaded or stored.' },
      { q: 'Can I use these for production?', a: 'Yes. UUIDs use crypto.randomUUID when available; hashes use Web Crypto. Use JWT Generator for payload encoding—sign with your secret in your app.' },
    ],
    sections: [
      {
        h2: 'Developer utilities in one place',
        paragraphs: [
          'Generate placeholder text (Lorem Ipsum), unique IDs (UUID), or random JSON for testing. Convert timestamps to dates and back, test regular expressions, build JWT payloads, compute MD5 and SHA-256 hashes, convert colors between Hex/RGB/HSL, and transform text case (camelCase, snake_case, etc.). All tools are client-side and free.',
        ],
      },
    ],
  },
  'converters': {
    slug: 'converters',
    title: 'Converters',
    description: 'Convert between data formats and generate code from JSON.',
    metaDescription: 'Free online converters: JSON to XML, CSV, YAML; XML to JSON; YAML to JSON; JSON to code (TypeScript, Python, Java, and more). 100% client-side.',
    faqs: [
      { q: 'What can I convert?', a: 'You can convert JSON to XML, CSV, YAML, and to code in multiple languages (e.g. TypeScript, Python, Java, Go). We also provide XML to JSON and YAML to JSON, plus CSV to JSON.' },
      { q: 'Are converters safe for sensitive data?', a: 'Yes. All conversion runs in your browser. No data is sent to our servers or any third party.' },
      { q: 'Do I need an account?', a: 'No. Every converter is free to use without registration.' },
      { q: 'What languages can I generate from JSON?', a: 'We offer JSON to TypeScript, Python, Java, Go, C#, Dart, Rust, Kotlin, Swift, and PHP—generating class or struct definitions from your JSON structure.' },
      { q: 'Where do I find JSON to CSV?', a: 'JSON to CSV is available as a dedicated tool and from the convert bar on JSON formatter/validator. Use it to turn JSON arrays into spreadsheet-friendly CSV.' },
    ],
    sections: [
      {
        h2: 'One place for format and code conversion',
        paragraphs: [
          'Converters bridge formats and languages. When an API returns JSON but your system expects XML, or your config is in YAML and you need JSON, the format converters handle it. When you have a JSON sample and need type definitions or classes in TypeScript, Python, Java, Go, C#, Dart, Rust, Kotlin, Swift, or PHP, the JSON-to-code converters generate them from your structure. This hub collects all of these in one place so you can move between formats and code without leaving the platform.',
          'Every converter runs in your browser. Paste input, get output. No uploads, no accounts, and no rate limits. The same editor and shortcuts you use for formatters and validators apply here.',
        ],
      },
      {
        h2: 'Format conversion vs code generation',
        paragraphs: [
          'Format converters (JSON to XML, JSON to CSV, JSON to YAML, XML to JSON, YAML to JSON, CSV to JSON) transform data from one serialization to another. Use them for integration, migration, or when downstream tools expect a different format. Code converters (JSON to TypeScript, Python, Java, etc.) take a JSON object and produce class or type definitions in the target language—useful for generating DTOs, API client types, or documentation from real payloads. Both kinds are available from this hub and from the relevant category hubs (e.g. JSON tools, XML tools) so you can start from either the format or the converter view.',
        ],
      },
    ],
  },
};
