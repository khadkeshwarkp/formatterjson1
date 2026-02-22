import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Random JSON Generator — Create Test Data Online Free',
  description: 'Generate random JSON objects for testing. Enter size (1–20) or leave empty for 5. 100% client-side.',
  keywords: ['random json', 'json generator', 'mock data', 'test data'],
  openGraph: { title: 'Random JSON Generator', description: 'Generate random JSON for testing. Free, client-side.', url: 'https://formatterjson.org/random-json-generator' },
  alternates: { canonical: 'https://formatterjson.org/random-json-generator' },
};

export default function RandomJsonGeneratorPage() {
  return <ToolPage toolId="random-json-generator" />;
}
