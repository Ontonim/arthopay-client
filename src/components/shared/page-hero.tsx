import type { ReactNode } from "react";
import { BackButton } from "./back-button";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-dot-grid relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
      <div className="relative mx-auto max-w-4xl px-5 pt-6 pb-14 text-center sm:px-8 sm:pt-8 sm:pb-18">
        <div className="mb-8 flex justify-start sm:mb-10">
          <BackButton />
        </div>
        <span className="-rotate-2 inline-block rounded-full border-2 border-ink bg-surface-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground shadow-hard-sm">
          {eyebrow}
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
