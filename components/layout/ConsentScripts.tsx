'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/gtag';

const CONSENT_KEY = 'consent_choice_v1';

type ConsentState = {
  analytics: boolean;
  ads: boolean;
};

export default function ConsentScripts() {
  const [state, setState] = useState<ConsentState>({ analytics: false, ads: false });

  useEffect(() => {
    const readConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored === 'granted') {
          setState({ analytics: true, ads: true });
        } else if (stored === 'denied' || !stored) {
          setState({ analytics: false, ads: false });
        } else {
          const parsed = JSON.parse(stored) as ConsentState;
          setState({
            analytics: Boolean(parsed.analytics),
            ads: Boolean(parsed.ads),
          });
        }
      } catch {
        setState({ analytics: false, ads: false });
      }
    };

    readConsent();
    const handler = () => readConsent();
    window.addEventListener('consent-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('consent-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <>
      {state.analytics && (
        <>
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
                gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
              `,
            }}
          />
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="eLIwKZ7cKfJi8ZaPw9TGEg"
            strategy="afterInteractive"
          />
        </>
      )}

      {state.ads && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8049153058740766"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
