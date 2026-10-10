'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';
import { X, Cookie, Settings } from 'lucide-react';

export default function CookieConsentBanner() {
  const { acceptAll, rejectAll, acceptCategory, showBanner, setShowBanner, consent } = useCookieConsent();

  if (!showBanner) return null;

  const openSettings = () => {
    // Re-show banner by clearing the dismissed flag
    localStorage.removeItem('pitchpulse-banner-dismissed');
    localStorage.removeItem('pitchpulse-cookie-consent');
    setShowBanner(true);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.3)] md:bottom-4 md:left-4 md:right-auto md:w-[420px] md:rounded-xl md:border md:shadow-lg animate-slide-up"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">We value your privacy</h3>
            <p id="cookie-consent-description" className="mt-1 text-xs text-slate-400">
              We use cookies to enhance your experience, analyze traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Dismiss cookie banner"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={acceptAll}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Accept All
          </button>
          
          <button
            onClick={rejectAll}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reject All
          </button>

          <button
            onClick={() => acceptCategory('analytics')}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
            Analytics Only
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          <a href="/privacy" className="underline hover:text-slate-300 transition-colors">Privacy Policy</a> · 
          <a href="/cookie-policy" className="underline hover:text-slate-300 transition-colors">Cookie Policy</a>
        </p>
      </div>
    </div>
  );
}

export function CookieSettingsLink() {
  const { setShowBanner } = useCookieConsent();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('pitchpulse-banner-dismissed');
    localStorage.removeItem('pitchpulse-cookie-consent');
    setShowBanner(true);
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="underline hover:text-[var(--text-secondary)] transition-colors text-sm text-[var(--text-muted)]"
    >
      Cookie Settings
    </a>
  );
}