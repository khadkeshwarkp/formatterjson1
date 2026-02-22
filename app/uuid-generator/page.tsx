import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'UUID Generator — Create UUID v4 Online Free',
  description: 'Generate UUID v4 identifiers. Enter count (1–50) or leave empty for 1. 100% client-side.',
  keywords: ['uuid', 'guid', 'unique id', 'generator'],
  openGraph: { title: 'UUID Generator', description: 'Generate UUID v4 identifiers. Free, client-side.', url: 'https://formatterjson.org/uuid-generator' },
  alternates: { canonical: 'https://formatterjson.org/uuid-generator' },
};

export default function UuidGeneratorPage() {
  return <ToolPage toolId="uuid-generator" />;
}
