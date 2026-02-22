import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-java'];
const url = 'https://formatterjson.org/json-to-java';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to Java',
  description: tool?.description ?? 'Generate Java classes from JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to Java', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-java" />;
}
