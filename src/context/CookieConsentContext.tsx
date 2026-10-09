'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type CookieCategory = 'necessary' | 'analytics' | 'marketing';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  hasConsented: boolean;
  acceptAll: () => void;
  acceptCategory: (category: CookieCategory) => void;
  rejectAll: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CONSENT_KEY = 'pitchpulse-cookie-consent';
const BANNER_DISMISSED_KEY = 'pitchpulse-banner-dismissed';

const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    const bannerDismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent(parsed);
        setShowBanner(false);
      } catch {
        setConsent(null);
        setShowBanner(true);
      }
    } else {
      setConsent(null);
      setShowBanner(!bannerDismissed);
    }
    setHydrated(true);
  }, []);

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setConsent(newConsent);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const acceptCategory = useCallback((category: CookieCategory) => {
    if (!consent) return;
    const updated = { ...consent, [category]: true, timestamp: Date.now() };
    saveConsent(updated);
  }, [consent, saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const value = {
    consent,
    hasConsented: !!consent,
    acceptAll,
    acceptCategory,
    rejectAll,
    showBanner: hydrated && showBanner && !consent,
    setShowBanner,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

export function useCookieCategory(category: CookieCategory) {
  const { consent } = useCookieConsent();
  return consent?.[category] ?? false;
}