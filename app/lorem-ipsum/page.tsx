import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Free Placeholder Text Online',
  description: 'Generate Lorem Ipsum placeholder text. Enter paragraphs (1–20) or leave empty for 3. 100% client-side.',
  keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'generator'],
  openGraph: { title: 'Lorem Ipsum Generator', description: 'Generate Lorem Ipsum placeholder text. Free, client-side.', url: 'https://formatterjson.org/lorem-ipsum' },
  alternates: { canonical: 'https://formatterjson.org/lorem-ipsum' },
};

export default function LoremIpsumPage() {
  return <ToolPage toolId="lorem-ipsum" />;
}
