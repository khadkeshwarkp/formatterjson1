import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-compare'];
const url = 'https://formatterjson.org/json-compare';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON Compare',
  description: tool?.description ?? 'Compare two JSON documents online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON Compare', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-compare" />;
}
