import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-escape'];
const url = 'https://formatterjson.org/json-escape';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON Escape',
  description: tool?.description ?? 'Escape string for JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON Escape', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-escape" />;
}
