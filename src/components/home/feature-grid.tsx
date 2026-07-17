import { Coins, Lock, Wallet, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant payouts",
    description: "Withdraw your earnings anytime — no waiting periods.",
  },
  {
    icon: Coins,
    title: "No hidden fees",
    description: "Transparent pricing. Know exactly what you keep.",
  },
  {
    icon: Wallet,
    title: "Custom support tiers",
    description: "Set your own Coffee, Tea, or custom amount options.",
  },
  {
    icon: Lock,
    title: "PIN + OTP security",
    description: "Every withdrawal is protected with two-step verification.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Why Arthopay
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Built for creators, by design
        </h2>
        <p className="mt-3 text-muted-foreground sm:text-lg">
          Everything you need, nothing you don&apos;t.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group flex flex-col gap-5 rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard-sm transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-hard"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-signature">
              <feature.icon className="h-5.5 w-5.5 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
