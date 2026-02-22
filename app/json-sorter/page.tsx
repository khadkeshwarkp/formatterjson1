import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-sorter'];
const url = 'https://formatterjson.org/json-sorter';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON Sorter',
  description: tool?.description ?? 'Sort JSON keys online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON Sorter', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-sorter" />;
}
