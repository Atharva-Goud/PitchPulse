import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { BeamsBackground } from '@/components/ui/beams-background';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PITCHINTEL | Football Intelligence. All in one place.',
  description: 'Your premier football intelligence platform. Latest news, transfer rumours, live scores, fixtures, and team analysis.',
  keywords: ['football', 'soccer', 'news', 'transfers', 'scores', 'fixtures', 'premier league', 'champions league'],
  authors: [{ name: 'PITCHINTEL' }],
  openGraph: {
    title: 'PITCHINTEL | Football Intelligence',
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
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <BeamsBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 bg-slate-950/50 py-8 px-4">
            <div className="mx-auto max-w-7xl text-center text-sm text-slate-500">
              <p>PITCHINTEL — Football intelligence. All in one place.</p>
              <p className="mt-1">Data sourced from public APIs and official sources.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}