import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import ConsentBanner from '@/components/layout/ConsentBanner';
import { GA_TRACKING_ID } from '@/lib/gtag';

const SITE_URL = 'https://formatterjson.org';

export const viewport = { width: 'device-width', initialScale: 1 } as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DevTools Workspace — Free Online Developer Tools',
    template: '%s | DevTools Workspace',
  },
  description:
    'Free online developer tools: JSON formatter, validator, minifier, JSON to XML converter, Base64 encoder/decoder. 100% client-side — your data never leaves your browser.',
  keywords: [
    'developer tools',
    'json formatter',
    'json validator',
    'json minifier',
    'json to xml',
    'base64 encoder',
    'base64 decoder',
    'online dev tools',
    'json beautifier',
    'json lint',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'DevTools Workspace',
    title: 'DevTools Workspace — Free Online Developer Tools',
    description:
      'JSON formatter, validator, minifier, converter & Base64 tools. Fast, private, 100% browser-based.',
    images: [
      {
        url: '/logo.png',
        width: 654,
        height: 496,
        alt: 'DevTools Workspace Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools Workspace — Free Online Developer Tools',
    description:
      'JSON formatter, validator, minifier, converter & Base64 tools. Fast, private, 100% browser-based.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Consent Mode v2 — must load FIRST before any Google tags */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });
            `,
          }}
        />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8049153058740766"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
