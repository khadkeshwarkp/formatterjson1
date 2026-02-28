import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';
import { TOOL_MAP } from '@/lib/tools-registry';

const tool = TOOL_MAP['json-string-to-object'];
const url = 'https://formatterjson.org/json-string-to-object';

export const metadata: Metadata = {
  title: tool?.seoH1 ?? 'JSON String to Object',
  description: tool?.description ?? 'Deserialize JSON string fields into objects or arrays online.',
  keywords: tool?.keywords,
  openGraph: {
    title: tool?.seoH1 ?? 'JSON String to Object',
    description: tool?.description,
    url,
  },
  twitter: {
    title: tool?.seoH1 ?? 'JSON String to Object',
    description: tool?.description,
  },
  alternates: { canonical: url },
};

export default function JsonStringToObjectPage() {
  return <ToolPage toolId="json-string-to-object" />;
}
