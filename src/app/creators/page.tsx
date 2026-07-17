"use client";

import { useMemo, useState } from "react";
import { Coffee, Search } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { cn } from "@/lib/utils";

const CREATORS = [
  { name: "Farhan Ahmed", username: "farhan.codes", tag: "Developer", rotate: "-rotate-2" },
  { name: "Nusrat Jahan", username: "nusrat.art", tag: "Illustrator", rotate: "rotate-2" },
  { name: "Rakib Hasan", username: "rakib.music", tag: "Musician", rotate: "-rotate-1" },
  { name: "Tania Sultana", username: "tania.writes", tag: "Writer", rotate: "rotate-1" },
  { name: "Imran Kabir", username: "imran.streams", tag: "Streamer", rotate: "-rotate-2" },
  { name: "Mitu Rahman", username: "mitu.cooks", tag: "Chef", rotate: "rotate-2" },
  { name: "Shakil Ahsan", username: "shakil.edits", tag: "Video editor", rotate: "-rotate-1" },
  { name: "Proma Deb", username: "proma.paints", tag: "Illustrator", rotate: "rotate-1" },
  { name: "Adnan Faruk", username: "adnan.codes", tag: "Developer", rotate: "-rotate-2" },
];

const CATEGORIES = ["All", "Developer", "Illustrator", "Musician", "Writer", "Streamer", "Chef", "Video editor"];

export default function CreatorsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return CREATORS.filter((creator) => {
      const matchesCategory = category === "All" || creator.tag === category;
      const matchesQuery =
        !query.trim() ||
        creator.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        creator.username.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Trending now"
          title="Discover people worth supporting"
          description="Browse creators across code, art, music, writing, and more — and become their next superfan."
        >
          <div className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-full border-2 border-ink bg-surface-elevated p-2 shadow-hard">
            <Search className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or username"
              className="w-full bg-transparent py-2 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
              aria-label="Search creators"
            />
          </div>
        </PageHero>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-colors duration-150",
                  category === cat
                    ? "bg-ink text-cream"
                    : "bg-surface-elevated text-foreground hover:bg-signature-soft",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-16 text-center text-sm font-semibold text-muted-foreground">
              No creators match &ldquo;{query}&rdquo; yet.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((creator) => (
                <div
                  key={creator.username}
                  className={`group rounded-2xl border-2 border-ink bg-surface-elevated p-5 shadow-hard transition-transform duration-200 hover:-translate-y-1.5 ${creator.rotate}`}
                >
                  <div className="h-14 w-14 rounded-full border-2 border-ink bg-signature" />
                  <p className="mt-4 font-display font-bold text-foreground">
                    {creator.name}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    @{creator.username}
                  </p>
                  <span className="mt-2 inline-block rounded-full border-2 border-ink bg-cream px-2.5 py-1 text-xs font-bold text-foreground">
                    {creator.tag}
                  </span>
                  <button className="press mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-signature py-2 text-sm font-bold text-primary-foreground">
                    <Coffee className="h-3.5 w-3.5" />
                    Support
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
