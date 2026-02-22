import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-sql'];
const url = 'https://formatterjson.org/json-to-sql';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to SQL',
  description: tool?.description ?? 'Convert JSON to SQL INSERTs online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to SQL', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-sql" />;
}
