import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | PitchPulse',
  description: 'PitchPulse Cookie Policy — What cookies we use, how consent works, and how to manage your preferences.',
  robots: 'noindex, follow',
};

export default function CookiePolicyPage() {
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="min-h-screen">
      <main id="main-content" className="flex-1">
        <article className="container-narrow py-16 lg:py-24">
          <header className="mb-12 text-center">
            <h1 className="text-heading mb-4">Cookie Policy</h1>
            <p className="text-body-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
          </header>

          <div className="prose prose-invert prose-slate max-w-none space-y-10">
            <section>
              <h2 className="text-section mb-4">1. What Are Cookies</h2>
              <p className="text-body">
                Cookies are small text files that websites store on your device (computer, phone, tablet) when you
                visit them. They help websites remember your preferences, understand how you use the site, and
                enable certain functionality. Cookies can be <q>session</q> (deleted when you close your browser)
                or <q>persistent</q> (remain until they expire or you delete them).
              </p>
              <p className="text-body">
                Similar technologies include <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code>,
                <code className="bg-slate-800 px-1 rounded text-xs font-mono">sessionStorage</code>, and IndexedDB,
                which store data in your browser without the automatic HTTP transmission that cookies have.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">2. Cookies and Storage Used by PitchPulse</h2>
              <p className="text-body mb-4">
                PitchPulse uses <strong>only first-party, essential</strong> browser storage. We do not set any
                cookies that are transmitted with HTTP requests. All preference data is stored in
                <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code>, which stays
                in your browser and is never sent to our servers.
              </p>

              <h3 className="text-heading-sm mb-3">2.1 Essential Storage (Always Active)</h3>
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
                    <td className="py-2">Stores your consent choices for necessary, analytics, and marketing categories, plus a timestamp</td>
                    <td className="py-2">Until cleared by you</td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 font-mono text-xs">pitchpulse-banner-dismissed</td>
                    <td className="py-2">localStorage</td>
                    <td className="py-2">Remembers that you have dismissed the cookie banner</td>
                    <td className="py-2">Until cleared by you</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-body">
                These are strictly necessary for the consent mechanism to function. Without them, the banner would
                reappear on every page load. They contain no personal identifiers.
              </p>

              <h3 className="text-heading-sm mb-3">2.2 Analytics Category (Reserved — Currently Inactive)</h3>
              <p className="text-body mb-4">
                The consent banner includes an <q>Analytics</q> category. <strong>This category currently performs
                no tracking.</strong> No analytics cookies (Google Analytics, Matomo, Plausible, etc.) are set,
                no events are sent to analytics endpoints, and no third-party analytics scripts are loaded.
              </p>
              <p className="text-body">
                If analytics are added in the future, they will only activate after you explicitly consent via the
                banner or the <q>Analytics Only</q> button. This policy will be updated accordingly.
              </p>

              <h3 className="text-heading-sm mb-3">2.3 Marketing Category (Reserved — Currently Inactive)</h3>
              <p className="text-body mb-4">
                The consent banner includes a <q>Marketing</q> category. <strong>This category currently performs
                no tracking.</strong> No advertising cookies, pixels, or third-party marketing scripts are loaded.
              </p>
              <p className="text-body">
                If marketing/ads are added in the future, they will only activate after explicit consent. This
                policy will be updated accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">3. How Consent Works on PitchPulse</h2>
              <p className="text-body mb-4">
                On your first visit (or after clearing browser data), a cookie consent banner appears at the
                bottom of the screen (bottom sheet on mobile, floating card on desktop). The banner offers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li><strong>Accept All</strong> — Enables all categories (currently only <q>Necessary</q> does
                  anything; <q>Analytics</q> and <q>Marketing</q> are placeholders).</li>
                <li><strong>Reject All</strong> — Keeps only <q>Necessary</q> enabled (the default, minimal state).</li>
                <li><strong>Analytics Only</strong> — Enables <q>Necessary</q> + <q>Analytics</q> (currently
                  same effect as <q>Reject All</q> since Analytics is inactive).</li>
                <li><strong>Dismiss (×)</strong> — Hides the banner without saving consent; it will reappear
                  on the next visit unless you make a choice.</li>
              </ul>
              <p className="text-body mb-4">
                Your choice is saved to <code className="bg-slate-800 px-1 rounded text-xs font-mono">localStorage</code>
                immediately. The banner will not reappear unless you clear browser data or manually reopen it.
              </p>

              <h3 className="text-heading-sm mb-3">3.1 Revisiting and Changing Your Preferences</h3>
              <p className="text-body mb-4">
                You can reopen the consent banner at any time to review or change your preferences:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-body ml-4 mb-4">
                <li>Open your browser's developer tools (F12).</li>
                <li>Go to the <q>Application</q> (Chrome/Edge) or <q>Storage</q> (Firefox) tab.</li>
                <li>Under <q>Local Storage</q>, find <code className="bg-slate-800 px-1 rounded text-xs font-mono">https://pitchpulse.vercel.app</code> (or your deployment URL).</li>
                <li>Delete the keys <code className="bg-slate-800 px-1 rounded text-xs font-mono">pitchpulse-cookie-consent</code>
                  and <code className="bg-slate-800 px-1 rounded text-xs font-mono">pitchpulse-banner-dismissed</code>.</li>
                <li>Reload the page — the banner will reappear.</li>
              </ol>
              <p className="text-body">
                <strong>Note:</strong> A dedicated <q>Cookie Settings</q> link in the footer (planned) will
                automate this process without requiring developer tools.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">4. Third-Party Cookies</h2>
              <p className="text-body mb-4">
                PitchPulse does <strong>not</strong> set third-party cookies. However, when you click external
                links (news article sources, data provider references), those third-party websites may set their
                own cookies under their own policies.
              </p>
              <p className="text-body">
                External links open in new tabs with <code className="bg-slate-800 px-1 rounded text-xs font-mono">rel="noopener noreferrer"</code>
                to limit the referring site's access to your session.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">5. How to Clear Cookies and Browser Storage</h2>
              <p className="text-body mb-4">
                You can clear all PitchPulse data from your browser at any time:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li><strong>Chrome/Edge:</strong> Settings → Privacy and security → Clear browsing data →
                  <q>Cookies and other site data</q> + <q>Cached images and files</q>.</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data →
                  <q>Clear Data</q>.</li>
                <li><strong>Safari:</strong> Settings → Privacy → <q>Manage Website Data</q> → search
                  <q>pitchpulse</q> → <q>Remove</q>.</li>
                <li><strong>Site-specific (all browsers):</strong> Click the lock/icon next to the URL →
                  <q>Cookies and site data</q> → delete entries for the PitchPulse domain.</li>
              </ul>
              <p className="text-body">
                Clearing this data will reset your consent preferences and the banner will reappear on your next visit.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">6. Relationship to Privacy Policy</h2>
              <p className="text-body">
                This Cookie Policy is part of our <a href="/privacy" className="underline hover:text-[var(--primary)]">Privacy Policy</a>.
                The Privacy Policy covers the broader context of data handling, third-party providers, and your rights.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">7. Changes to This Policy</h2>
              <p className="text-body mb-4">
                If we add analytics, advertising, or other tracking in the future, this policy will be updated
                to reflect the actual behavior. The <q>Last updated</q> date at the top reflects the most recent change.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">8. Contact</h2>
              <p className="text-body mb-2">
                Questions about this policy or our cookie practices:
              </p>
              <ul className="list-disc list-inside space-y-1 text-body ml-4">
                <li>Email: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[PRIVACY_CONTACT_EMAIL]</code></li>
                <li>GitHub Issues: <a href="https://github.com/Atharva-Goud/PitchPulse/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--primary)]">github.com/Atharva-Goud/PitchPulse/issues</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">9. Legal Basis and Jurisdiction</h2>
              <p className="text-body mb-4">
                <strong>Placeholder — Operator must complete:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li>Legal entity / trading name: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[LEGAL_ENTITY_NAME]</code></li>
                <li>Registered address: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[REGISTERED_ADDRESS]</code></li>
                <li>Governing law: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[GOVERNING_LAW_JURISDICTION]</code></li>
              </ul>
              <p className="text-body text-sm text-[var(--text-muted)]">
                This policy describes current implementation only. It is not a guarantee of compliance with
                the ePrivacy Directive, GDPR, UK GDPR, India's DPDP Act, or other laws. Complete placeholders
                and seek qualified counsel before production use.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}