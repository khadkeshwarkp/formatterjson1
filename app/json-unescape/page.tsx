import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-unescape'];
const url = 'https://formatterjson.org/json-unescape';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON Unescape',
  description: tool?.description ?? 'Unescape JSON string online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON Unescape', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-unescape" />;
}
