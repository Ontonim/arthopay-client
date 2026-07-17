import type { Metadata } from "next";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { FaqAccordion } from "@/components/shared/faq-accordion";

export const metadata: Metadata = {
  title: "Help Center — Arthopay",
  description: "Answers to common questions about creating your page, getting paid, and staying secure on Arthopay.",
};

const FAQS = [
  {
    question: "How do I create my Arthopay page?",
    answer:
      "Tap \"Get started\" and sign up with your name, username, and email. Your page goes live instantly at arthopay.com/yourusername — no coding or approval wait required.",
  },
  {
    question: "How fast do I get paid?",
    answer:
      "Supporter payments land in your Arthopay balance immediately. You can withdraw to your bank account or mobile wallet any time, with no minimum waiting period.",
  },
  {
    question: "What payment methods can my supporters use?",
    answer:
      "Supporters can pay by card, mobile banking, or other local methods through our SSLCommerz integration — whatever is easiest for them.",
  },
  {
    question: "Is my withdrawal secure?",
    answer:
      "Yes. Every withdrawal requires your personal PIN plus a one-time code (OTP) sent to your registered phone number, so only you can move your money.",
  },
  {
    question: "Does Arthopay charge any fees?",
    answer:
      "There are no setup costs or monthly subscriptions. Arthopay takes a small, transparent platform fee from each supporter payment — shown clearly at checkout.",
  },
  {
    question: "Can I change my username later?",
    answer:
      "Yes, from your account settings. Keep in mind links you've already shared with your old username will need to be updated.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Contact our support team from the Contact page and we'll process your deletion request, subject to any transaction records we're required to retain.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Help center"
          title="Answers to your questions"
          description="Can't find what you're looking for? Our team is one message away."
        />

        <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8 sm:pb-28">
          <FaqAccordion items={FAQS} />

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-signature">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground">
                Chat with support
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Message our team for anything account or payout related.
              </p>
              <Link
                href="/contact"
                className="press mt-1 flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-cream"
              >
                Contact us
              </Link>
            </div>

            <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-signature">
                <LifeBuoy className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground">
                Security concern?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Report suspicious activity on your account right away.
              </p>
              <a
                href="mailto:security@arthopay.com"
                className="press mt-1 flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface-elevated px-4 py-2 text-sm font-bold text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                security@arthopay.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
