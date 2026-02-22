import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-excel'];
const url = 'https://formatterjson.org/json-to-excel';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to Excel',
  description: tool?.description ?? 'Convert JSON to CSV for Excel online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to Excel', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-excel" />;
}
