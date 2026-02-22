import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'JWT Generator — Create JWT from JSON Online Free',
  description: 'Build JWT from JSON payload. Paste JSON; get header.payload (unsigned). Add signature in your app. 100% client-side.',
  keywords: ['jwt', 'json web token', 'generator', 'payload'],
  openGraph: { title: 'JWT Generator', description: 'Create JWT from JSON payload. Free, client-side.', url: 'https://formatterjson.org/jwt-generator' },
  alternates: { canonical: 'https://formatterjson.org/jwt-generator' },
};

export default function JwtGeneratorPage() {
  return <ToolPage toolId="jwt-generator" />;
}
