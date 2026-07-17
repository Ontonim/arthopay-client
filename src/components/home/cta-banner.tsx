import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-ink bg-signature px-8 py-16 text-center shadow-hard-lg sm:px-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-10" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Start receiving support today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/85 sm:text-lg">
            Join hundreds of creators already earning from the people who
            believe in their work.
          </p>
          <Link
            href="/register"
            className="press mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink bg-ink px-8 py-4 text-sm font-bold text-cream"
          >
            Create your page — it&apos;s free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
