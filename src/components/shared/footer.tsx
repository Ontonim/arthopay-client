import Link from "next/link";
import { Logo } from "./logo";

const LINKS = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Explore creators", href: "#creators" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  Support: [
    { label: "Help center", href: "/help" },
    { label: "Contact us", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo inverted />
            <p className="mt-3 max-w-50 text-sm text-cream/60">
              The easiest way to receive support from your fans.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="font-display text-sm font-bold text-cream">
                {group}
              </p>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="cursor-pointer text-sm font-medium text-cream/60 transition-colors duration-150 hover:text-cream"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-cream/15 pt-8 sm:flex-row">
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} Arthopay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
