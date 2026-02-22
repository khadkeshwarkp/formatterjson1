import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Text Case Converter — camelCase, snake_case Online Free',
  description: 'Convert text to lowercase, UPPERCASE, Title Case, camelCase, snake_case, kebab-case. 100% client-side.',
  keywords: ['text case', 'camelCase', 'snake_case', 'kebab-case', 'converter'],
  openGraph: { title: 'Text Case Converter', description: 'Convert text to different cases. Free, client-side.', url: 'https://formatterjson.org/text-case-converter' },
  alternates: { canonical: 'https://formatterjson.org/text-case-converter' },
};

export default function TextCaseConverterPage() {
  return <ToolPage toolId="text-case-converter" />;
}
