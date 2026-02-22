import type { Metadata } from 'next';
import HubPage from '@/components/hub/HubPage';
import { TOOLS } from '@/lib/tools-registry';
import { HUB_CONTENT } from '@/lib/hub-content';

const slug = 'yaml-tools';
const content = HUB_CONTENT[slug];
const tools = TOOLS.filter((t) => t.category === 'yaml');

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
  openGraph: { title: content.title, description: content.metaDescription, url: 'https://formatterjson.org/yaml-tools' },
  alternates: { canonical: 'https://formatterjson.org/yaml-tools' },
};

export default function YamlToolsHubPage() {
  return <HubPage slug={slug} tools={tools} />;
}
