import Link from "next/link";
import { Heart, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { BackButton } from "@/components/shared/back-button";
import type { ReactNode } from "react";

const TRUST_POINTS = [
  { icon: Zap, label: "Instant payouts" },
  { icon: ShieldCheck, label: "PIN + OTP secured" },
];

export function AuthShell({
  panelTitle,
  panelDescription,
  children,
}: {
  panelTitle: string;
  panelDescription: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
      {/* brand panel — desktop only */}
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(76,140,105,0.35), transparent 55%)",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <Link href="/" className="w-fit">
            <Logo inverted />
          </Link>
          <BackButton variant="inverted" />
        </div>

        <div className="relative flex flex-col gap-6">
          <h2 className="font-display max-w-md text-4xl font-bold leading-[1.1] tracking-tight text-cream">
            {panelTitle}
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-cream/70">
            {panelDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border-2 border-cream/20 bg-cream/5 px-3.5 py-1.5 text-xs font-bold text-cream"
              >
                <Icon className="h-3.5 w-3.5 text-signature" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-float relative w-72 rotate-2 rounded-[24px] border-2 border-cream/15 bg-cream/[0.06] p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-cream/20 bg-signature">
              <Heart className="h-4.5 w-4.5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-cream">
                Farhan Ahmed
              </p>
              <p className="text-xs font-semibold text-cream/50">
                @farhan.codes
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            &ldquo;Set up my page in five minutes — got my first supporter the
            same day.&rdquo;
          </p>
        </div>
      </div>

      {/* form panel */}
      <div className="flex flex-col bg-cream">
        <div className="flex items-center justify-between px-5 py-6 sm:px-8 lg:hidden">
          <BackButton />
          <Link href="/">
            <Logo />
          </Link>
          <span className="w-18" aria-hidden="true" />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
