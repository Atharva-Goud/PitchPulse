import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PitchPulse',
  description: 'PitchPulse Privacy Policy — How we handle your data, cookies, and third-party services.',
  robots: 'noindex, follow',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="min-h-screen">
      <main id="main-content" className="flex-1">
        <article className="container-narrow py-16 lg:py-24">
          <header className="mb-12 text-center">
            <h1 className="text-heading mb-4">Privacy Policy</h1>
            <p className="text-body-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
          </header>

          <div className="prose prose-invert prose-slate max-w-none space-y-10">
            <section>
              <h2 className="text-section mb-4">1. Overview</h2>
              <p className="text-body">
                PitchPulse is a football intelligence platform that aggregates live scores, fixtures, standings,
                statistics, news, and transfer information from public APIs and official sources. This policy
                explains what data we process, how we process it, and your rights.
              </p>
              <p className="text-body">
                We do not operate a user account system, collect personal identifiers (name, email, IP address),
                or run our own analytics or advertising trackers. The data we handle falls into two categories:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li><strong>Local preference data</strong> — cookie consent choices stored in your browser's
                  <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code>.</li>
                <li><strong>Aggregated football data</strong> — match scores, fixtures, standings, news articles,
                  and transfer rumours fetched from third-party providers and displayed to you.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">2. Information We Collect</h2>
              <h3 className="text-heading-sm mb-3">2.1 Data you provide directly</h3>
              <p className="text-body mb-4">
                PitchPulse does not have registration, login, contact forms, comment systems, or newsletters.
                You do not submit personal data to us.
              </p>

              <h3 className="text-heading-sm mb-3">2.2 Data stored locally in your browser</h3>
              <p className="text-body mb-4">
                When you interact with the cookie consent banner, we store your preferences in
                <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code> under the keys:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li><code className="bg-slate-800 px-1 rounded text-xs font-mono">pitchpulse-cookie-consent</code> —
                  your consent choices (necessary, analytics, marketing) and a timestamp.</li>
                <li><code className="bg-slate-800 px-1 rounded text-xs font-mono">pitchpulse-banner-dismissed</code> —
                  a flag indicating you have dismissed the banner.</li>
              </ul>
              <p className="text-body">
                This data never leaves your device. We do not read, transmit, or process it on any server.
                You can clear it at any time via your browser settings.
              </p>

              <h3 className="text-heading-sm mb-3">2.3 Data from third-party providers</h3>
              <p className="text-body mb-4">
                PitchPulse displays football data sourced from the following providers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li><strong>worldcup26.ir</strong> — live scores, fixtures, standings, match events, statistics,
                  and club rosters (public, no API key required).</li>
                <li><strong>RSS feeds</strong> — football news from BBC Sport, ESPN FC, The Guardian Football,
                  Football Italia, TalkSPORT, FourFourTwo, Liverpool Echo, Manchester Evening News, and others.</li>
                <li><strong>NewsAPI (optional)</strong> — additional football news if an API key is configured.</li>
              </ul>
              <p className="text-body">
                We do not share your identity with these providers. Requests to their APIs are made from our
                server (for RSS/NewsAPI) or your browser (for worldcup26.ir) without personal identifiers.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">3. Cookies and Local Storage</h2>
              <p className="text-body mb-4">
                PitchPulse uses only <strong>first-party, essential</strong> cookies and <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code> entries:
              </p>
              <table className="w-full text-sm text-left border-collapse mb-4">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="pb-2 font-semibold text-white">Key</th>
                    <th className="pb-2 font-semibold text-white">Type</th>
                    <th className="pb-2 font-semibold text-white">Purpose</th>
                    <th className="pb-2 font-semibold text-white">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 font-mono text-xs">pitchpulse-cookie-consent</td>
                    <td className="py-2">localStorage</td>
                    <td className="py-2">Stores your cookie consent choices</td>
                    <td className="py-2">Until cleared</td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 font-mono text-xs">pitchpulse-banner-dismissed</td>
                    <td className="py-2">localStorage</td>
                    <td className="py-2">Remembers that you dismissed the banner</td>
                    <td className="py-2">Until cleared</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-body">
                We do <strong>not</strong> use third-party analytics cookies (e.g., Google Analytics, Matomo),
                advertising cookies, social media trackers, or fingerprinting scripts. The <q>Analytics</q> and
                <q>Marketing</q> categories in the consent banner are reserved for future use and currently
                perform no tracking.
              </p>
              <p className="text-body">
                For full details, see our <a href="/cookie-policy" className="underline hover:text-[var(--primary)]">Cookie Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">4. Third-Party Services and External Links</h2>
              <p className="text-body mb-4">
                PitchPulse includes links to external websites:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>News article source URLs (BBC, ESPN, Guardian, etc.) — opened in new tabs with
                  <code className="bg-slate-800 px-1 rounded text-xs font-mono">rel="noopener noreferrer"</code>.</li>
                <li>Football data provider (worldcup26.ir) — referenced as the data source.</li>
              </ul>
              <p className="text-body">
                We are not responsible for the privacy practices of these third parties. When you follow an
                external link, their privacy policies apply.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">5. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li><strong>localStorage consent data:</strong> Retained until you clear it via browser settings
                  or the cookie consent banner's <q>Reject All</q> option (which overwrites with a minimal
                  necessary-only consent).</li>
                <li><strong>Server-side cached football data:</strong> Cached for up to 5 minutes (API responses)
                  or 30 seconds (individual endpoints) to reduce load on third-party APIs. No personal data is cached.</li>
                <li><strong>News articles:</strong> Stored as static JSON files (<code className="bg-slate-800 px-1 rounded text-xs font-mono">src/data/news/latest.json</code>,
                  <code className="bg-slate-800 px-1 rounded text-xs font-mono">trending.json</code>) and refreshed
                  every 6 hours via GitHub Actions. These contain only public article metadata.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">6. Data Security</h2>
              <p className="text-body mb-4">
                Since we do not collect personal data, there is no personal data to secure. Technical measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>HTTPS enforced on all routes (Vercel default).</li>
                <li>No authentication system, no database, no user sessions.</li>
                <li>Content Security Policy headers via Next.js defaults.</li>
                <li>External links use <code className="bg-slate-800 px-1 rounded text-xs font-mono">rel="noopener noreferrer"</code>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">7. Your Rights</h2>
              <p className="text-body mb-4">
                Because PitchPulse does not process personal data, most data-subject rights (access, rectification,
                erasure, portability, restriction, objection) are not applicable. You retain full control over
                the <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code> entries
                in your browser and can delete them at any time.
              </p>
              <p className="text-body">
                If you believe we are processing personal data not described here, please contact us (see Section 9).
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">8. Children's Privacy</h2>
              <p className="text-body">
                PitchPulse is not directed at children under 13 (or the applicable age in your jurisdiction).
                We do not knowingly collect personal data from children. If you are a parent or guardian and
                believe your child has provided personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">9. Contact</h2>
              <p className="text-body mb-2">
                Questions about this policy or our data practices:
              </p>
              <ul className="list-disc list-inside space-y-1 text-body ml-4">
                <li>Email: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[PRIVACY_CONTACT_EMAIL]</code></li>
                <li>GitHub Issues: <a href="https://github.com/Atharva-Goud/PitchPulse/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--primary)]">github.com/Atharva-Goud/PitchPulse/issues</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">10. Changes to This Policy</h2>
              <p className="text-body">
                We may update this policy as the platform evolves. The <q>Last updated</q> date at the top
                reflects the most recent change. Continued use of PitchPulse after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">11. Legal Basis and Jurisdiction</h2>
              <p className="text-body mb-4">
                <strong>Placeholder — Operator must complete:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li>Legal entity / trading name: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[LEGAL_ENTITY_NAME]</code></li>
                <li>Registered address: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[REGISTERED_ADDRESS]</code></li>
                <li>Governing law: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[GOVERNING_LAW_JURISDICTION]</code></li>
                <li>Data Protection Officer (if applicable): <code className="bg-slate-800 px-1 rounded text-xs font-mono">[DPO_CONTACT]</code></li>
              </ul>
              <p className="text-body text-sm text-[var(--text-muted)]">
                This policy is a practical draft based on current implementation. It is not a substitute for
                legal review. Complete the placeholders and seek qualified counsel before relying on it for
                regulatory compliance.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}