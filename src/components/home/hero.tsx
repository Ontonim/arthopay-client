import { ArrowUpRight, Coffee, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroSearch } from "./hero-search";
import { SquiggleUnderline } from "./squiggle-underline";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-dot-grid bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 pt-14 pb-24 sm:px-8 sm:pt-20 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
        {/* left: copy */}
        <div className="animate-fade-in-up flex flex-col items-start gap-7">
          <div className="-rotate-2 flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground shadow-hard-sm">
            <Sparkles className="h-3.5 w-3.5 text-signature" />
            Now live for Bangladeshi creators
          </div>

          <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
            Turn your fans
            <br />
            into{" "}
            <span className="relative inline-block">
              superfans
              <SquiggleUnderline />
            </span>
            .
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-xl">
            Create a page in minutes, share it anywhere, and receive support
            from the people who love what you make — one coffee at a time.
          </p>

          <HeroSearch />

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Link
              href="/register"
              className="press flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink bg-ink px-7 py-3.5 text-sm font-bold text-cream shadow-hard-signature"
            >
              Start your page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center -space-x-3">
              {["#4C8C69", "#18140F", "#6c6255", "#dcebe1"].map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-ink"
                  style={{ background: c }}
                />
              ))}
              <span className="pl-5 text-sm font-bold text-foreground/70">
                500+ creators onboard
              </span>
            </div>
          </div>
        </div>

        {/* right: sticker card */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-sm items-center justify-center lg:flex">
          <div className="animate-float relative w-72 rotate-3 rounded-[24px] border-2 border-ink bg-surface-elevated p-6 shadow-hard-lg">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 rounded-full border-2 border-ink bg-signature" />
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  Farhan Ahmed
                </p>
                <p className="text-sm font-semibold text-muted-foreground">
                  @farhan.codes
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              &ldquo;Thank you for the coffee, means the world&rdquo;
            </p>
            <button className="press mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-signature py-3 text-sm font-bold text-primary-foreground">
              <Coffee className="h-4 w-4" />
              Buy a coffee — ৳50
            </button>
          </div>

          <div
            className="animate-float absolute -left-8 top-2 -rotate-6 rounded-2xl border-2 border-ink bg-surface-elevated px-4 py-3 shadow-hard"
            style={{ animationDelay: "-2s" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-cream">
                <Heart className="h-3.5 w-3.5 text-signature" fill="currentColor" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-foreground">New supporter!</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  +৳100 from Rafi
                </p>
              </div>
            </div>
          </div>

          <div
            className="animate-float absolute -right-6 bottom-4 rotate-6 rounded-2xl border-2 border-ink bg-ink px-5 py-3.5 shadow-hard-signature"
            style={{ animationDelay: "-3.5s" }}
          >
            <p className="text-xs font-semibold text-cream/60">This month</p>
            <p className="font-display text-xl font-bold text-cream">৳24,500</p>
          </div>
        </div>
      </div>
    </section>
  );
}
