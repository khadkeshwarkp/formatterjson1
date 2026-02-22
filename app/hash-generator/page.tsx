import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Hash Generator — MD5 & SHA-256 Online Free',
  description: 'Generate MD5 and SHA-256 hashes of your input. Paste text; get hex hashes. 100% client-side.',
  keywords: ['hash', 'md5', 'sha256', 'checksum', 'generator'],
  openGraph: { title: 'Hash Generator', description: 'MD5 and SHA-256 hashes. Free, client-side.', url: 'https://formatterjson.org/hash-generator' },
  alternates: { canonical: 'https://formatterjson.org/hash-generator' },
};

export default function HashGeneratorPage() {
  return <ToolPage toolId="hash-generator" />;
}
