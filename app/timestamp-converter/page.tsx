import type { Metadata } from 'next';
import ToolPage from '@/components/editor/ToolPage';

export const metadata: Metadata = {
  title: 'Timestamp Converter — Unix to Date Online Free',
  description: 'Convert Unix timestamps to dates and back. Enter timestamp, date string, or leave empty for now. 100% client-side.',
  keywords: ['timestamp', 'unix time', 'date converter', 'epoch'],
  openGraph: { title: 'Timestamp Converter', description: 'Convert Unix timestamp to date and back. Free, client-side.', url: 'https://formatterjson.org/timestamp-converter' },
  alternates: { canonical: 'https://formatterjson.org/timestamp-converter' },
};

export default function TimestampConverterPage() {
  return <ToolPage toolId="timestamp-converter" />;
}
