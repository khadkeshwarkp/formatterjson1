import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['parse-json-string'];
const url = 'https://formatterjson.org/parse-json-string';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'Parse JSON String',
  description: tool?.description ?? 'Parse JSON strings with nested-depth diagnostics online.',
  keywords: tool?.keywords,
  openGraph: {
    title: tool?.seoH1 ?? 'Parse JSON String',
    description: tool?.description,
    url,
  },
  twitter: {
    title: tool?.seoH1 ?? 'Parse JSON String',
    description: tool?.description,
  },
  alternates: { canonical: url },
};

export default function ParseJsonStringPage() {
  return <ToolPage toolId="parse-json-string" />;
}
