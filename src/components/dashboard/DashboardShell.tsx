"use client";

import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  userName?: string;
}

export function DashboardShell({ children, userName }: DashboardShellProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back{userName ? `, ${userName}` : ""} 👋
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Your account is verified – here’s your dashboard.
        </p>
      </div>
      {children}
    </div>
  );
}