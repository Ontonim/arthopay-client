"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { KycGate } from "@/components/kyc/kyc-gate";
import { SellerDashboard } from "@/components/dashboard/SellerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";

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

  // Guard: user should exist when authenticated, but we handle null gracefully
  if (!user) {
    // Redirect or show an error – here we show a friendly message
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm font-semibold text-danger">
          User data not available. Please log in again.
        </p>
      </div>
    );
  }

  const role = user.role === "SELLER" ? "seller" : "user";

  return (
    <KycGate>
      {role === "seller" ? (
        <SellerDashboard user={user} />
      ) : (
        <UserDashboard user={user} />
      )}
    </KycGate>
  );
}