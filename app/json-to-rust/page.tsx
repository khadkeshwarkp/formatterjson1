import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-rust'];
const url = 'https://formatterjson.org/json-to-rust';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to Rust',
  description: tool?.description ?? 'Generate Rust structs from JSON online.',
  openGraph: { title: tool?.seoH1 ?? 'JSON to Rust', description: tool?.description, url },
  alternates: { canonical: url },
};

export default function Page() {
  return <ToolPage toolId="json-to-rust" />;
}
