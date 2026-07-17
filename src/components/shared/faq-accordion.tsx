"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border-2 border-ink bg-surface-elevated shadow-hard-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="font-display font-bold text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-signature transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
