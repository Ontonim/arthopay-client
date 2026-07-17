import type { Metadata } from "next";
import { Quote, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/home/cta-banner";

export const metadata: Metadata = {
  title: "Success stories — Arthopay",
  description:
    "Real creators, real earnings — see how Bangladeshi creators are turning their fans into recurring support with Arthopay.",
};

const STORIES = [
  {
    name: "Farhan Ahmed",
    username: "farhan.codes",
    tag: "Developer",
    quote:
      "Set up my page in five minutes — got my first supporter the same day. Six months in, coffee tips cover my entire hosting budget.",
    stat: "৳38,400 raised",
    rotate: "-rotate-2",
  },
  {
    name: "Nusrat Jahan",
    username: "nusrat.art",
    tag: "Illustrator",
    quote:
      "My commissions used to depend on one platform's mood. Now fans support my personal art directly, no algorithm required.",
    stat: "৳61,200 raised",
    rotate: "rotate-1",
  },
  {
    name: "Rakib Hasan",
    username: "rakib.music",
    tag: "Musician",
    quote:
      "I dropped my Arthopay link under every track. Instant payouts mean I can actually pay my studio bills on time now.",
    stat: "৳27,900 raised",
    rotate: "-rotate-1",
  },
  {
    name: "Tania Sultana",
    username: "tania.writes",
    tag: "Writer",
    quote:
      "Readers wanted to say thanks for my newsletter. Arthopay gave them a one-tap way to do it — no awkward payment links.",
    stat: "৳15,600 raised",
    rotate: "rotate-2",
  },
];

const STATS = [
  { label: "Creators supported", value: "500+" },
  { label: "Raised for creators", value: "৳12L+" },
  { label: "Payments processed", value: "10k+" },
  { label: "Average payout time", value: "< 24h" },
];

export default function SuccessStoriesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Real creators, real results"
          title="Fans showed up. Here's what happened next."
          description="A few of the hundreds of creators already earning from the people who believe in their work."
        />

        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border-2 border-ink bg-ink px-6 py-8 shadow-hard sm:grid-cols-4 sm:px-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-cream sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-cream/60 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {STORIES.map((story) => (
              <div
                key={story.username}
                className={`flex flex-col gap-5 rounded-2xl border-2 border-ink bg-surface-elevated p-7 shadow-hard transition-transform duration-200 hover:-translate-y-1.5 ${story.rotate}`}
              >
                <Quote className="h-7 w-7 text-signature" fill="currentColor" />
                <p className="text-base leading-relaxed text-foreground">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center justify-between border-t-2 border-ink/10 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full border-2 border-ink bg-signature" />
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">
                        {story.name}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        @{story.username} · {story.tag}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-signature-soft px-3 py-1.5 text-xs font-bold text-accent-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {story.stat}
                  </span>
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
