import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-to-string'];
const url = 'https://formatterjson.org/json-to-string';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON to String',
  description: tool?.description ?? 'Serialize JSON to escaped string literals online.',
  keywords: tool?.keywords,
  openGraph: {
    title: tool?.seoH1 ?? 'JSON to String',
    description: tool?.description,
    url,
  },
  twitter: {
    title: tool?.seoH1 ?? 'JSON to String',
    description: tool?.description,
  },
  alternates: { canonical: url },
};

export default function JsonToStringPage() {
  return <ToolPage toolId="json-to-string" />;
}
