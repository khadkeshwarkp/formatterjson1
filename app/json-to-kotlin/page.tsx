import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-kotlin'];
const url = 'https://formatterjson.org/json-to-kotlin';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to Kotlin',
  description: tool?.description ?? 'Generate Kotlin data classes from JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to Kotlin', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-kotlin" />;
}
