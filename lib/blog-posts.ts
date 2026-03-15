export interface BlogPostSummary {
  href: string;
  title: string;
  desc: string;
}

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    href: '/blog/how-to-fix-invalid-json-errors',
    title: 'How to Fix Invalid JSON Errors',
    desc: 'Troubleshoot parse errors, unexpected tokens, and broken payloads in real-world API workflows.',
  },
  {
    href: '/blog/json-pretty-print-vs-minify',
    title: 'JSON Pretty Print vs Minify: What\'s the Difference?',
    desc: 'When to beautify JSON and when to minify it for transport, debugging, and production.',
  },
  {
    href: '/blog/json-diff-explained',
    title: 'Deep Guide: JSON Diff Explained',
    desc: 'Understand additions, deletions, modifications, and type mismatches when comparing JSON.',
  },
  {
    href: '/blog/convert-json-to-csv-and-back',
    title: 'Convert JSON to CSV (and Back)',
    desc: 'Practical conversion patterns, edge cases, and examples for developer and analyst workflows.',
  },
  {
    href: '/blog/best-practices-validating-json-online',
    title: 'Best Practices for Validating JSON Online',
    desc: 'Validate large files safely and fix JSON syntax with fast repeatable debugging workflows.',
  },
];
