'use client';

import { useEffect, useState } from 'react';

const BANNER_KEY = 'consent_choice_v1';

type ConsentState = {
  analytics: boolean;
  ads: boolean;
};

const DEFAULT_STATE: ConsentState = { analytics: false, ads: false };

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [state, setState] = useState<ConsentState>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BANNER_KEY);
      if (!stored) {
        setVisible(true);
        return;
      }

      let nextState: ConsentState = DEFAULT_STATE;
      if (stored === 'granted') {
        nextState = { analytics: true, ads: true };
      } else if (stored === 'denied') {
        nextState = { analytics: false, ads: false };
      } else {
        try {
          const parsed = JSON.parse(stored) as ConsentState;
          nextState = {
            analytics: Boolean(parsed.analytics),
            ads: Boolean(parsed.ads),
          };
        } catch {
          nextState = DEFAULT_STATE;
        }
      }

      setState(nextState);
      const consent = {
        ad_storage: nextState.ads ? 'granted' : 'denied',
        ad_user_data: nextState.ads ? 'granted' : 'denied',
        ad_personalization: nextState.ads ? 'granted' : 'denied',
        analytics_storage: nextState.analytics ? 'granted' : 'denied',
      };
      window.gtag && window.gtag('consent', 'update', consent);
      window.dispatchEvent(new Event('consent-updated'));
    } catch {}
  }, []);

  const updateConsent = (next: ConsentState) => {
    try {
      if (next.analytics && next.ads) {
        localStorage.setItem(BANNER_KEY, 'granted');
      } else if (!next.analytics && !next.ads) {
        localStorage.setItem(BANNER_KEY, 'denied');
      } else {
        localStorage.setItem(BANNER_KEY, JSON.stringify(next));
      }
    } catch {}

    const consent = {
      ad_storage: next.ads ? 'granted' : 'denied',
      ad_user_data: next.ads ? 'granted' : 'denied',
      ad_personalization: next.ads ? 'granted' : 'denied',
      analytics_storage: next.analytics ? 'granted' : 'denied',
    };

    window.gtag && window.gtag('consent', 'update', consent);
    window.dispatchEvent(new Event('consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0f172a] text-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] text-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="m-0">
          We use cookies for analytics and ads. Non-essential cookies are blocked until you choose.
          See our{' '}
          <a href="/privacy" className="text-blue-400 underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowOptions((v) => !v)}
            className="px-3 py-1.5 bg-slate-700 text-white border-0 rounded-md cursor-pointer text-sm hover:bg-slate-600"
          >
            Customize
          </button>
          <button
            onClick={() => updateConsent({ analytics: false, ads: false })}
            className="px-3 py-1.5 bg-slate-700 text-white border-0 rounded-md cursor-pointer text-sm hover:bg-slate-600"
          >
            Reject All
          </button>
          <button
            onClick={() => updateConsent({ analytics: true, ads: true })}
            className="px-3 py-1.5 bg-green-500 text-[#0b1a0f] border-0 rounded-md cursor-pointer text-sm font-semibold hover:bg-green-400"
          >
            Accept All
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="mt-3 rounded-lg border border-slate-600/50 bg-slate-900/60 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.analytics}
                onChange={(e) => setState((s) => ({ ...s, analytics: e.target.checked }))}
              />
              Analytics cookies
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.ads}
                onChange={(e) => setState((s) => ({ ...s, ads: e.target.checked }))}
              />
              Advertising cookies
            </label>
            <button
              onClick={() => updateConsent(state)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-400"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
