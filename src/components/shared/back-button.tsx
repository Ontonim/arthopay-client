"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton({
  variant = "default",
  className,
}: {
  variant?: "default" | "inverted";
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "flex w-fit cursor-pointer items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors duration-150",
        variant === "inverted"
          ? "border-cream/25 bg-cream/10 text-cream hover:bg-cream/15"
          : "border-ink/15 bg-signature-soft text-foreground hover:border-ink/25",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
