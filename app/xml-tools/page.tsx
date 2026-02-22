import type { Metadata } from 'next';
import HubPage from '@/components/hub/HubPage';
import { TOOLS } from '@/lib/tools-registry';
import { HUB_CONTENT } from '@/lib/hub-content';

const slug = 'xml-tools';
const content = HUB_CONTENT[slug];
const tools = TOOLS.filter((t) => t.category === 'xml');

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
  openGraph: { title: content.title, description: content.metaDescription, url: 'https://formatterjson.org/xml-tools' },
  alternates: { canonical: 'https://formatterjson.org/xml-tools' },
};

export default function XmlToolsHubPage() {
  return <HubPage slug={slug} tools={tools} />;
}
