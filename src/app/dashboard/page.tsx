"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { KycGate } from "@/components/kyc/kyc-gate";

export default function DashboardPage() {
  const { user, isInitializing, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-signature" />
      </div>
    );
  }

  return (
    <KycGate>
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            স্বাগতম, {user?.firstName} 👋
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            তোমার business verified — dashboard এখন খোলা।
          </p>
        </div>

        {/* Admin phase বসানোর পরে এখানে products/orders/payments-এর মতো
            requireKyc-locked module গুলো যোগ হবে। */}
      </div>
    </KycGate>
  );
}