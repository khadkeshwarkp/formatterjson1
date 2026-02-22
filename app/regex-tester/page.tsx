import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Regex Tester — Test Regular Expressions Online Free',
  description: 'Test regex against text. First line: pattern, remaining lines: text. See all matches. 100% client-side.',
  keywords: ['regex', 'regular expression', 'tester', 'pattern match'],
  openGraph: { title: 'Regex Tester', description: 'Test regular expressions against text. Free, client-side.', url: 'https://formatterjson.org/regex-tester' },
  alternates: { canonical: 'https://formatterjson.org/regex-tester' },
};

export default function RegexTesterPage() {
  return <ToolPage toolId="regex-tester" />;
}
