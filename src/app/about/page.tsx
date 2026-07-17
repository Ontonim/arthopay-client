import type { Metadata } from "next";
import { Heart, Rocket, Target, Users } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/home/cta-banner";

export const metadata: Metadata = {
  title: "About — Arthopay",
  description:
    "Arthopay is on a mission to help Bangladeshi creators earn a living from the people who love what they make.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Creators first",
    description:
      "Every decision we make starts with one question: does this help a creator get paid faster and keep more of it?",
  },
  {
    icon: Target,
    title: "Radically simple",
    description:
      "No code, no confusing dashboards. A creator should be able to set up a page and share it in minutes, not days.",
  },
  {
    icon: Rocket,
    title: "Built for Bangladesh",
    description:
      "Local payment methods, Taka pricing, and support that understands the realities of creating here — not a copy-paste of a foreign product.",
  },
];

const TEAM = [
  { name: "Sabbir Rahman", role: "Founder & CEO" },
  { name: "Afsana Mimi", role: "Head of Product" },
  { name: "Tanvir Islam", role: "Engineering Lead" },
  { name: "Ruma Akter", role: "Creator Success" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Our story"
          title="Helping creators earn from what they already make"
          description="Arthopay started with a simple idea: Bangladeshi creators deserve an easy, trustworthy way to receive support from the people who love their work."
        />

        <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="rounded-2xl border-2 border-ink bg-surface-elevated p-8 shadow-hard sm:p-12">
            <p className="text-base leading-relaxed text-foreground sm:text-lg">
              We watched talented developers, artists, musicians, and writers
              build loyal audiences online with no simple way to turn that
              love into income. Existing tools were built for other markets —
              wrong currency, wrong payment methods, wrong assumptions.
            </p>
            <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">
              So we built Arthopay: a support page any creator can set up in
              minutes, accept payments the way Bangladeshi fans actually pay,
              and withdraw earnings instantly — protected by PIN and OTP at
              every step.
            </p>
          </div>
        </section>

        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="-rotate-1 inline-block rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                What we believe
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                The principles behind Arthopay
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="flex flex-col gap-5 rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard-sm transition-transform duration-200 hover:-translate-y-1.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-signature">
                    <value.icon className="h-5.5 w-5.5 text-primary-foreground" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rotate-1 inline-block rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
              <Users className="mr-1 inline h-3.5 w-3.5" />
              The team
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Small team, big mission
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink bg-surface-elevated p-6 text-center shadow-hard-sm"
              >
                <div className="h-16 w-16 rounded-full border-2 border-ink bg-signature" />
                <div>
                  <p className="font-display text-sm font-bold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
