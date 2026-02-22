import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Color Converter — Hex, RGB, HSL Online Free',
  description: 'Convert between Hex, RGB, and HSL. Paste #RRGGBB, rgb(r,g,b), or hsl(h,s%,l%). 100% client-side.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl'],
  openGraph: { title: 'Color Converter', description: 'Convert Hex, RGB, HSL. Free, client-side.', url: 'https://formatterjson.org/color-converter' },
  alternates: { canonical: 'https://formatterjson.org/color-converter' },
};

export default function ColorConverterPage() {
  return <ToolPage toolId="color-converter" />;
}
