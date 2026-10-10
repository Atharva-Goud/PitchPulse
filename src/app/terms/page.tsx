import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | PitchPulse',
  description: 'PitchPulse Terms and Conditions — Acceptable use, data accuracy, liability, and intellectual property.',
  robots: 'noindex, follow',
};

export default function TermsPage() {
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="min-h-screen">
      <main id="main-content" className="flex-1">
        <article className="container-narrow py-16 lg:py-24">
          <header className="mb-12 text-center">
            <h1 className="text-heading mb-4">Terms and Conditions</h1>
            <p className="text-body-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
          </header>

          <div className="prose prose-invert prose-slate max-w-none space-y-10">
            <section>
              <h2 className="text-section mb-4">1. Acceptance of Terms</h2>
              <p className="text-body">
                By accessing and using PitchPulse (<q>the Website</q>), you agree to be bound by these Terms
                and Conditions (<q>Terms</q>). If you do not agree, please do not use the Website.
              </p>
              <p className="text-body">
                These Terms apply to all visitors, users, and anyone who accesses or uses the Website.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">2. Description of Service</h2>
              <p className="text-body mb-4">
                PitchPulse is a football intelligence platform that aggregates and displays:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Live scores, fixtures, and match events</li>
                <li>League standings and tables</li>
                <li>Match statistics (possession, shots, cards, etc.)</li>
                <li>Football news from multiple publishers</li>
                <li>Transfer rumours and confirmed deals</li>
                <li>Team and player information</li>
              </ul>
              <p className="text-body">
                All data is sourced from third-party providers (see Section 4). PitchPulse does not create,
                verify, or guarantee the accuracy of the underlying football data.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">3. Acceptable Use</h2>
              <p className="text-body mb-4">
                You agree to use the Website only for lawful purposes and in accordance with these Terms.
                You must not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Use automated systems (bots, scrapers, crawlers) to extract data at scale without permission.</li>
                <li>Attempt to gain unauthorized access to any part of the Website, its servers, or connected systems.</li>
                <li>Transmit viruses, malware, or any code designed to disrupt, damage, or limit functionality.</li>
                <li>Use the Website for any illegal activity or to promote illegal acts.</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
              </ul>
              <p className="text-body">
                We reserve the right to restrict or block access from IP addresses or networks that violate
                these terms or degrade service for others.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">4. Third-Party Data Providers and Accuracy</h2>
              <p className="text-body mb-4">
                PitchPulse displays data from the following third-party sources:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li><strong>worldcup26.ir</strong> — Live scores, fixtures, standings, match events, statistics,
                  club rosters (public API, no API key).</li>
                <li><strong>RSS feeds</strong> — News articles from BBC Sport, ESPN FC, The Guardian Football,
                  Football Italia, TalkSPORT, FourFourTwo, Liverpool Echo, Manchester Evening News, and others.</li>
                <li><strong>NewsAPI (optional)</strong> — Additional news if an API key is configured by the operator.</li>
              </ul>
              <p className="text-body mb-4">
                <strong>No guarantee of accuracy, completeness, or timeliness.</strong> Data may be delayed,
                incomplete, incorrect, or unavailable due to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Provider API outages, rate limits, or schema changes.</li>
                <li>Network errors or caching delays (server-side cache: 30 seconds to 5 minutes).</li>
                <li>Source publisher corrections or retractions after we have cached the data.</li>
                <li>Time zone or scheduling discrepancies.</li>
              </ul>
              <p className="text-body">
                PitchPulse is for informational and entertainment purposes only. Do not rely on it for betting,
                financial decisions, or any purpose where inaccuracies could cause harm.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">5. Informational Purposes Only</h2>
              <p className="text-body">
                The Website and all content are provided <q>as is</q> and <q>as available</q> without warranties
                of any kind, express or implied, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, non-infringement, or accuracy. We do not
                warrant that the Website will be uninterrupted, error-free, or free of harmful components.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">6. Intellectual Property</h2>
              <h3 className="text-heading-sm mb-3">6.1 PitchPulse Content</h3>
              <p className="text-body mb-4">
                The Website's design, layout, original code, UI components, and aggregated presentation are
                owned by the operator (<code className="bg-slate-800 px-1 rounded text-xs font-mono">[LEGAL_ENTITY_NAME]</code>).
                You may not copy, reproduce, distribute, or create derivative works without permission.
              </p>

              <h3 className="text-heading-sm mb-3">6.2 Third-Party Content</h3>
              <p className="text-body mb-4">
                All football data, news articles, images, logos, trademarks, and brand assets belong to their
                respective owners:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Match data, team logos, league logos — respective leagues, clubs, and worldcup26.ir.</li>
                <li>News articles, headlines, images — respective publishers (BBC, ESPN, Guardian, etc.).</li>
                <li>Player photos, club badges — rights holders as indicated by the source.</li>
              </ul>
              <p className="text-body">
                PitchPulse claims no ownership over third-party content. We display it under fair use,
                API terms, or RSS syndication. If you believe your rights are infringed, see Section 11.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">7. External Links</h2>
              <p className="text-body mb-4">
                The Website contains links to third-party websites (news sources, data providers). These links
                are provided for convenience only. We do not control, endorse, or assume responsibility for
                the content, privacy practices, or security of any third-party site.
              </p>
              <p className="text-body">
                Your use of external links is at your own risk. The linked sites' terms and privacy policies apply.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">8. Limitation of Liability</h2>
              <p className="text-body mb-4">
                To the maximum extent permitted by applicable law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>PitchPulse and its operator shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including loss of profits, data, use, or goodwill.</li>
                <li>Total liability for any claim arising from these Terms or the Website shall not exceed
                  the amount you paid to use the Website (zero, as it is free).</li>
                <li>We are not liable for any loss or damage resulting from reliance on football scores,
                  fixtures, standings, news, or transfer information displayed on the Website.</li>
              </ul>
              <p className="text-body">
                Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability,
                so the above may not apply fully to you.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">9. Indemnification</h2>
              <p className="text-body">
                You agree to indemnify, defend, and hold harmless the operator and its affiliates from any
                claims, damages, losses, or expenses (including reasonable legal fees) arising from your
                violation of these Terms, your misuse of the Website, or your infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">10. Changes to the Website and Terms</h2>
              <p className="text-body mb-4">
                We may modify, suspend, or discontinue the Website (or any feature) at any time without notice.
                We may update these Terms at any time. The <q>Last updated</q> date at the top reflects the
                most recent change. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">11. Termination</h2>
              <p className="text-body">
                We may terminate or suspend your access to the Website immediately, without prior notice, for
                any breach of these Terms. Sections 4, 5, 6, 7, 8, 9, 12, and 13 survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="text-body mb-4">
                <strong>Placeholder — Operator must complete:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Governing law: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[GOVERNING_LAW_JURISDICTION]</code></li>
                <li>Exclusive jurisdiction: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[COURT_JURISDICTION]</code></li>
                <li>Alternative dispute resolution (if any): <code className="bg-slate-800 px-1 rounded text-xs font-mono">[ADR_PROCESS]</code></li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">13. Contact and Legal Notices</h2>
              <p className="text-body mb-4">
                <strong>Placeholder — Operator must complete:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4 mb-4">
                <li>Legal entity / trading name: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[LEGAL_ENTITY_NAME]</code></li>
                <li>Registered address: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[REGISTERED_ADDRESS]</code></li>
                <li>Contact email: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[LEGAL_CONTACT_EMAIL]</code></li>
                <li>DMCA / copyright agent: <code className="bg-slate-800 px-1 rounded text-xs font-mono">[DMCA_AGENT_EMAIL]</code></li>
              </ul>
              <p className="text-body">
                For general inquiries, use the GitHub Issues link in the footer or email the address above.
              </p>
            </section>

            <section>
              <h2 className="text-section mb-4">14. General Provisions</h2>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li><strong>Severability:</strong> If any provision is held unenforceable, the remainder
                  remains in effect.</li>
                <li><strong>Waiver:</strong> Failure to enforce a right does not waive it.</li>
                <li><strong>Assignment:</strong> We may assign these Terms; you may not assign without consent.</li>
                <li><strong>Entire agreement:</strong> These Terms, together with the Privacy Policy and
                  Cookie Policy, constitute the entire agreement between you and the operator.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-section mb-4">15. Disclaimer</h2>
              <p className="text-body text-sm text-[var(--text-muted)]">
                These Terms are a practical draft based on current implementation. They are not a substitute
                for legal review. Complete all placeholders and seek qualified counsel before relying on them
                for legal protection or regulatory compliance.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}