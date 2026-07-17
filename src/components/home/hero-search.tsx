"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function HeroSearch() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim().replace(/^@/, "");
    if (trimmed) router.push(`/${trimmed}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2 rounded-full border-2 border-ink bg-surface-elevated p-2 shadow-hard"
    >
      <div className="flex flex-1 items-center gap-1.5 pl-3.5">
        <span className="font-semibold text-muted-foreground">arthopay.com/</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full bg-transparent py-2 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
          aria-label="Search creator by username"
        />
      </div>
      <button
        type="submit"
        className="press flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-signature px-5 py-2.5 text-sm font-bold text-primary-foreground"
      >
        Find
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
