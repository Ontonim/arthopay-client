import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/arthopay_logo.png"
        alt="Arthopay"
        width={36}
        height={36}
        className="h-9 w-9 object-contain"
        priority
      />
      <span
        className={cn(
          "font-display text-xl font-bold italic tracking-tight",
          inverted ? "text-cream" : "text-foreground",
        )}
      >
        Arthopay
      </span>
    </span>
  );
}
