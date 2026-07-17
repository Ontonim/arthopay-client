import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { LegalSection } from "@/components/shared/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy — Arthopay",
  description: "How Arthopay collects, uses, and protects your data.",
};

const SECTIONS = [
  { id: "collection", label: "1. Information we collect" },
  { id: "use", label: "2. How we use it" },
  { id: "sharing", label: "3. Sharing your data" },
  { id: "security", label: "4. How we protect it" },
  { id: "retention", label: "5. Data retention" },
  { id: "rights", label: "6. Your rights" },
  { id: "cookies", label: "7. Cookies" },
  { id: "contact", label: "8. Contact us" },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Legal"
          title="Privacy Policy"
          description="Last updated July 18, 2026. Your trust matters to us — here's exactly what we do with your data."
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
              <LegalSection id="collection" title="1. Information we collect">
                <p>
                  We collect information you give us directly — your name,
                  email, username, and phone number for OTP verification —
                  along with payout details like your bank account or mobile
                  wallet number.
                </p>
                <p>
                  We also collect usage data automatically, such as device
                  type, browser, and pages visited, to keep the platform
                  secure and improve it.
                </p>
              </LegalSection>

              <LegalSection id="use" title="2. How we use it">
                <p>
                  We use your information to operate your creator page,
                  process supporter payments, verify withdrawals with PIN and
                  OTP, prevent fraud, and communicate important account
                  updates.
                </p>
              </LegalSection>

              <LegalSection id="sharing" title="3. Sharing your data">
                <p>
                  We share only what&apos;s necessary with our payment
                  processor, SSLCommerz, to complete transactions. We never
                  sell your personal data to advertisers or third parties.
                </p>
              </LegalSection>

              <LegalSection id="security" title="4. How we protect it">
                <p>
                  All sensitive data is encrypted in transit and at rest.
                  Withdrawals require PIN and OTP confirmation, and our
                  systems are monitored continuously for suspicious activity.
                </p>
              </LegalSection>

              <LegalSection id="retention" title="5. Data retention">
                <p>
                  We retain account and transaction data for as long as your
                  account is active and as required by financial regulations
                  after closure.
                </p>
              </LegalSection>

              <LegalSection id="rights" title="6. Your rights">
                <p>
                  You can access, correct, or request deletion of your
                  personal data at any time by contacting our support team,
                  subject to our legal obligation to retain certain
                  transaction records.
                </p>
              </LegalSection>

              <LegalSection id="cookies" title="7. Cookies">
                <p>
                  We use essential cookies to keep you signed in and
                  understand how the platform is used. You can control
                  cookies through your browser settings.
                </p>
              </LegalSection>

              <LegalSection id="contact" title="8. Contact us">
                <p>
                  Questions about this policy? Reach out any time on our{" "}
                  <a
                    href="/contact"
                    className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
                  >
                    Contact page
                  </a>
                  .
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
