import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-typescript'];
const url = 'https://formatterjson.org/json-to-typescript';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to TypeScript',
  description: tool?.description ?? 'Generate TypeScript interfaces from JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to TypeScript', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-typescript" />;
}
