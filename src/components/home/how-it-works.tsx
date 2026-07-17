import { Link2, UserPlus, Wallet } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Sign up in minutes, add your photo, bio, and set your custom support tiers.",
    rotate: "-rotate-2",
  },
  {
    icon: Link2,
    title: "Share your link",
    description:
      "Drop arthopay.com/you in your bio, videos, or stream — anywhere your fans are.",
    rotate: "rotate-1",
  },
  {
    icon: Wallet,
    title: "Get paid instantly",
    description:
      "Fans support you via SSLCommerz. Withdraw anytime, secured with PIN + OTP.",
    rotate: "-rotate-1",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Simple by design
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Three steps to your first supporter
        </h2>
        <p className="mt-3 text-muted-foreground sm:text-lg">
          No code, no setup fees — just a page fans will love.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-ink bg-surface-elevated p-8 text-center shadow-hard transition-transform duration-200 hover:-translate-y-1 md:items-start md:text-left ${step.rotate}`}
          >
            <span className="absolute -top-4 -left-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-ink font-display text-sm font-bold text-cream">
              {i + 1}
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-signature">
              <step.icon className="h-6 w-6 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
