import { Coffee } from "lucide-react";

const CREATORS = [
  { name: "Farhan Ahmed", username: "farhan.codes", tag: "Developer", rotate: "-rotate-2" },
  { name: "Nusrat Jahan", username: "nusrat.art", tag: "Illustrator", rotate: "rotate-2" },
  { name: "Rakib Hasan", username: "rakib.music", tag: "Musician", rotate: "-rotate-1" },
  { name: "Tania Sultana", username: "tania.writes", tag: "Writer", rotate: "rotate-1" },
  { name: "Imran Kabir", username: "imran.streams", tag: "Streamer", rotate: "-rotate-2" },
];

export function FeaturedCreators() {
  return (
    <section id="creators" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <span className="inline-block rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Trending now
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Creators on Arthopay
        </h2>
        <p className="mt-2 text-muted-foreground sm:text-lg">
          Discover people worth supporting.
        </p>
      </div>

      <div className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8">
        {CREATORS.map((creator) => (
          <div
            key={creator.username}
            className={`group w-64 shrink-0 snap-start rounded-2xl border-2 border-ink bg-surface-elevated p-5 shadow-hard transition-transform duration-200 hover:-translate-y-1.5 ${creator.rotate}`}
          >
            <div className="h-14 w-14 rounded-full border-2 border-ink bg-signature" />
            <p className="mt-4 font-display font-bold text-foreground">
              {creator.name}
            </p>
            <p className="text-sm font-medium text-muted-foreground">@{creator.username}</p>
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
    </section>
  );
}
