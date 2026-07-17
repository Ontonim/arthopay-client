import { CheckCircle2, Coffee, Lock, Users, Zap } from "lucide-react";

const STATS = [
  { icon: Users, label: "500+ creators" },
  { icon: Coffee, label: "৳12L+ support raised" },
  { icon: Zap, label: "10k+ payments processed" },
  { icon: Lock, label: "PIN + OTP secured" },
  { icon: CheckCircle2, label: "99.9% uptime" },
];

const LOOP = [...STATS, ...STATS];

export function TrustStrip() {
  return (
    <section className="overflow-hidden border-y-2 border-ink bg-ink py-4">
      <div className="animate-marquee flex w-max items-center gap-4">
        {LOOP.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-cream/30 px-5 py-2 text-sm font-bold text-cream"
          >
            <item.icon className="h-4 w-4 text-signature" />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
