import type { Metadata } from 'next';
import HubPage from '@/components/hub/HubPage';
import { TOOL_MAP } from '@/lib/tools-registry';
import { HUB_CONTENT } from '@/lib/hub-content';

const slug = 'converters';
const content = HUB_CONTENT[slug];
// Conversion tools: format-to-format and json-to-* (we'll add language converters later)
const converterIds = [
  'json-to-xml', 'json-to-csv', 'json-to-yaml', 'csv-to-json', 'yaml-to-json', 'xml-to-json',
  'json-to-typescript', 'json-to-python', 'json-to-java', 'json-to-go', 'json-to-csharp',
  'json-to-dart', 'json-to-rust', 'json-to-kotlin', 'json-to-swift', 'json-to-php',
];
const tools = converterIds.map((id) => TOOL_MAP[id]).filter(Boolean);

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
  openGraph: { title: content.title, description: content.metaDescription, url: 'https://formatterjson.org/converters' },
  alternates: { canonical: 'https://formatterjson.org/converters' },
};

export default function ConvertersHubPage() {
  return <HubPage slug={slug} tools={tools} />;
}
