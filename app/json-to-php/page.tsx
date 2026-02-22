import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-php'];
const url = 'https://formatterjson.org/json-to-php';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to PHP',
  description: tool?.description ?? 'Generate PHP classes from JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to PHP', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-php" />;
}
