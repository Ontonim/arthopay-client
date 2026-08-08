"use client";

import { DashboardShell } from "./DashboardShell";

interface SellerDashboardProps {
  user?: {
    firstName?: string;
    // add other fields as needed
  } | null;
}

export function SellerDashboard({ user }: SellerDashboardProps) {
  const userName = user?.firstName || "Seller";
  return (
    <DashboardShell userName={userName}>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Seller widgets */}
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Products</h2>
          <p className="text-sm text-muted-foreground">Manage your product listings.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Orders</h2>
          <p className="text-sm text-muted-foreground">View and fulfill orders.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Sales and performance stats.</p>
        </div>
        <div className="rounded-2xl border-2 border-ink/10 bg-surface-elevated p-6 shadow-hard-sm">
          <h2 className="font-display text-xl font-bold">Payouts</h2>
          <p className="text-sm text-muted-foreground">Track your earnings.</p>
        </div>
      </div>
    </DashboardShell>
  );
}