import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-one-line'];
const url = 'https://formatterjson.org/json-to-one-line';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to One Line',
  description: tool?.description ?? 'Minify JSON to one line online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to One Line', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-one-line" />;
}
