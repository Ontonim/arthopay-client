"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Explore creators", href: "/creators" },
  { label: "Success stories", href: "/success-stories" },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b-2 border-ink bg-cream/90 backdrop-blur-sm transition-[height,box-shadow] duration-300",
          scrolled ? "h-16 shadow-hard-sm" : "h-19",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-signature-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature",
                    active ? "text-signature-dark" : "text-foreground",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute left-1/2 -bottom-2.25 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-signature transition-transform duration-200",
                      active ? "scale-100" : "scale-0 group-hover:scale-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-bold text-foreground transition-colors duration-150 hover:bg-signature-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="press group flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-signature px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-hard-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature focus-visible:ring-offset-2"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="press cursor-pointer rounded-full border-2 border-ink bg-surface-elevated p-2.5 text-foreground shadow-hard-sm md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-70 w-[85%] max-w-sm border-l-2 border-ink bg-cream transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-19 items-center justify-between border-b-2 border-ink px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="press cursor-pointer rounded-full border-2 border-ink bg-surface-elevated p-2.5 text-foreground shadow-hard-sm"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-5">
          {NAV_LINKS.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 text-base font-bold transition-colors duration-150 hover:bg-signature-soft",
                  active ? "bg-signature-soft text-signature-dark" : "text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-signature" />
                )}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col gap-2 border-t-2 border-ink pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-full px-4 py-3 text-center text-sm font-bold text-foreground transition-colors duration-150 hover:bg-signature-soft"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="press flex cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-signature px-4 py-3 text-sm font-bold text-primary-foreground shadow-hard-sm"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
