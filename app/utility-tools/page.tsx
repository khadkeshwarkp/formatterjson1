import type { Metadata } from 'next';
import HubPage from '@/components/hub/HubPage';
import { TOOLS } from '@/lib/tools-registry';
import { HUB_CONTENT } from '@/lib/hub-content';

const slug = 'utility-tools';
const content = HUB_CONTENT[slug as keyof typeof HUB_CONTENT];
const tools = TOOLS.filter((t) => t.category === 'utility');

export const metadata: Metadata = {
  title: content.title,
  description: content.metaDescription,
  openGraph: { title: content.title, description: content.metaDescription, url: 'https://formatterjson.org/utility-tools' },
  alternates: { canonical: 'https://formatterjson.org/utility-tools' },
};

export default function UtilityToolsHubPage() {
  return <HubPage slug={slug} tools={tools} />;
}
