import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['string-to-json'];
const url = 'https://formatterjson.org/string-to-json';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'String to JSON',
  description: tool?.description ?? 'Convert escaped JSON strings to structured JSON online.',
  keywords: tool?.keywords,
  openGraph: {
    title: tool?.seoH1 ?? 'String to JSON',
    description: tool?.description,
    url,
  },
  twitter: {
    title: tool?.seoH1 ?? 'String to JSON',
    description: tool?.description,
  },
  alternates: { canonical: url },
};

export default function StringToJsonPage() {
  return <ToolPage toolId="string-to-json" />;
}
