import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { LegalSection } from "@/components/shared/legal-section";

export const metadata: Metadata = {
  title: "Terms of Service — Arthopay",
  description: "The terms that govern your use of Arthopay.",
};

const SECTIONS = [
  { id: "acceptance", label: "1. Acceptance of terms" },
  { id: "accounts", label: "2. Your account" },
  { id: "payments", label: "3. Payments & payouts" },
  { id: "conduct", label: "4. Acceptable use" },
  { id: "fees", label: "5. Fees" },
  { id: "termination", label: "6. Termination" },
  { id: "liability", label: "7. Limitation of liability" },
  { id: "changes", label: "8. Changes to these terms" },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Legal"
          title="Terms of Service"
          description="Last updated July 18, 2026. Please read these terms carefully before using Arthopay."
        />

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
            <nav className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-1 rounded-2xl border-2 border-ink bg-surface-elevated p-4 shadow-hard-sm">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:bg-signature-soft hover:text-foreground"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="flex flex-col gap-12 rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard sm:p-10">
              <LegalSection id="acceptance" title="1. Acceptance of terms">
                <p>
                  By creating an account or using Arthopay in any way, you
                  agree to be bound by these Terms of Service and our Privacy
                  Policy. If you do not agree, please do not use the
                  platform.
                </p>
              </LegalSection>

              <LegalSection id="accounts" title="2. Your account">
                <p>
                  You are responsible for maintaining the confidentiality of
                  your login credentials, PIN, and OTP codes. You must
                  provide accurate information when creating your creator
                  page and keep it up to date.
                </p>
                <p>
                  You must be at least 18 years old, or have the consent of a
                  parent or legal guardian, to receive payouts through
                  Arthopay.
                </p>
              </LegalSection>

              <LegalSection id="payments" title="3. Payments & payouts">
                <p>
                  Supporter payments are processed through SSLCommerz.
                  Arthopay does not store your full card details. Payouts to
                  creators are released instantly to your linked bank account
                  or mobile wallet, subject to identity verification.
                </p>
                <p>
                  All withdrawal requests require PIN and OTP confirmation.
                  Arthopay may delay or decline a payout if we suspect fraud
                  or a violation of these terms.
                </p>
              </LegalSection>

              <LegalSection id="conduct" title="4. Acceptable use">
                <p>
                  You may not use Arthopay to solicit support for illegal
                  activity, to mislead supporters about what their
                  contribution funds, or to process payments unrelated to
                  genuine creator support.
                </p>
              </LegalSection>

              <LegalSection id="fees" title="5. Fees">
                <p>
                  Arthopay charges a transparent platform fee on each
                  supporter payment, disclosed at the time of transaction.
                  There are no setup fees, monthly subscriptions, or hidden
                  charges.
                </p>
              </LegalSection>

              <LegalSection id="termination" title="6. Termination">
                <p>
                  You may close your account at any time. We may suspend or
                  terminate accounts that violate these terms, with notice
                  where reasonably possible.
                </p>
              </LegalSection>

              <LegalSection id="liability" title="7. Limitation of liability">
                <p>
                  Arthopay is provided &ldquo;as is.&rdquo; To the extent
                  permitted by law, Arthopay is not liable for indirect or
                  consequential damages arising from your use of the
                  platform.
                </p>
              </LegalSection>

              <LegalSection id="changes" title="8. Changes to these terms">
                <p>
                  We may update these terms from time to time. We will notify
                  you of material changes by email or through the platform
                  before they take effect.
                </p>
              </LegalSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
