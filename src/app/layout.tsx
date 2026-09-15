import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import AppShell from '@/components/layout/AppShell';
import { BeamsBackground } from '@/components/ui/beams-background';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Display font for headings - Russo One for bold, energetic feel
const russoOne = {
  variable: '--font-russo-one',
  src: 'url(https://fonts.gstatic.com/s/russoone/v16/Z9XUDmZRWg6MlhR6kwQ.woff2) format("woff2")',
  weight: '400',
  style: 'normal',
  display: 'swap',
} as const;

// Chakra Petch for UI text - gaming/esports feel with good readability
const chakraPetch = {
  variable: '--font-chakra-petch',
  src: 'url(https://fonts.gstatic.com/s/chakrapetch/v11/6NUU8F2OJg6MEcS9jE0.woff2) format("woff2")',
  weight: '300 400 500 600 700',
  style: 'normal',
  display: 'swap',
} as const;

export const metadata: Metadata = {
  title: 'PitchPulse | Football Intelligence. All in one place.',
  description: 'Your premier football intelligence platform. Latest news, transfer rumours, live scores, fixtures, and team analysis.',
  keywords: ['football', 'soccer', 'news', 'transfers', 'scores', 'fixtures', 'premier league', 'champions league'],
  authors: [{ name: 'PitchPulse' }],
  openGraph: {
    title: 'PitchPulse | Football Intelligence',
    description: 'Your premier football intelligence platform.',
    type: 'website',
    locale: 'en_GB',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0f0d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Russo+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-slate-950" aria-hidden="true" />
        <BeamsBackground />
        <AppShell>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <footer className="border-t border-[var(--border-default)] bg-[var(--surface-0)]/80 py-8 px-4 backdrop-blur-sm">
              <div className="mx-auto max-w-7xl text-center text-sm text-[var(--text-muted)]">
                <p>PitchPulse — Football intelligence. All in one place.</p>
                <p className="mt-1">Data sourced from public APIs and official sources.</p>
              </div>
            </footer>
          </div>
        </AppShell>
      </body>
    </html>
  );
}