import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-editor'];
const url = 'https://formatterjson.org/json-editor';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON Editor',
  description: tool?.description ?? 'Edit and format JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON Editor', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-editor" />;
}
