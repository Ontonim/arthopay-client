"use client";

import { DashboardShell } from "./DashboardShell";

interface UserDashboardProps {
  user?: {
    firstName?: string;
  } | null;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const userName = user?.firstName || "User";
  return (
    <DashboardShell userName={userName}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Orders</h2>
          <p className="text-sm text-muted-foreground">Track your recent orders.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Wishlist</h2>
          <p className="text-sm text-muted-foreground">Items you have saved.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your account details.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Support</h2>
          <p className="text-sm text-muted-foreground">Get help when you need it.</p>
        </div>
      </div>
    </DashboardShell>
  );
}