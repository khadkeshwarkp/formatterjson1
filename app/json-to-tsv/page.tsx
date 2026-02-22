import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-tsv'];
const url = 'https://formatterjson.org/json-to-tsv';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to TSV',
  description: tool?.description ?? 'Convert JSON to TSV online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to TSV', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-tsv" />;
}
