"use client";

import { type ReactNode } from "react";
import { Loader2, ShieldAlert, ShieldCheck, Clock3, MessageCircleWarning } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { KycForm } from "@/components/kyc/kyc-form";
import { useState } from "react";
import { useKycStatus } from "../hooks/use-kyc-status";

/**
 * Seller dashboard-এর যেকোনো route-কে এভাবে wrap করলেই KYC lock কার্যকর হয়ে যায়:
 *
 *   <KycGate>{dashboardContent}</KycGate>
 *
 * status অনুযায়ী কী দেখাবে (ডকের "Frontend Note" টেবিল অনুযায়ী):
 *  NOT_SUBMITTED → বন্ধ করা যায় না এমন modal + খালি form
 *  PENDING       → "Review চলছে" screen
 *  REJECTED      → rejectionReason + "admin-এর সাথে যোগাযোগ করুন" (edit বাটন নেই)
 *  APPROVED      → modal সরিয়ে আসল dashboard content render হয়
 *
 * fetch + setState লজিক পুরোটাই `useKycStatus` hook-এ (আলাদা file) — এই
 * component শুধু state পড়ে UI render করে, তাই এখানে কোনো effect-lint
 * warning আসার সুযোগই নেই।
 */

export function KycGate({ children }: { children: ReactNode }) {
  const { state, refresh } = useKycStatus();
  const [showForm, setShowForm] = useState(false);

  if (state.phase === "loading") {
    return (
      <FullScreenShell>
        <Loader2 className="h-6 w-6 animate-spin text-signature" />
        <p className="text-sm font-semibold text-muted-foreground">
          Verification status যাচাই হচ্ছে…
        </p>
      </FullScreenShell>
    );
  }

  if (state.phase === "error") {
    return (
      <FullScreenShell>
        <ShieldAlert className="h-8 w-8 text-danger" />
        <p className="max-w-sm text-center text-sm font-semibold text-danger">
          {state.message}
        </p>
        <RetryButton onClick={refresh} />
      </FullScreenShell>
    );
  }

  if (state.status === "APPROVED") {
    return <>{children}</>;
  }

  if (state.status === "PENDING") {
    return (
      <FullScreenShell>
        <Clock3 className="h-8 w-8 text-signature" />
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            Review চলছে
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            তোমার business verification admin-এর কাছে জমা আছে। Approve হয়ে গেলে
            dashboard আপনাআপনি খুলে যাবে — আবার login করার দরকার নেই।
          </p>
        </div>
      </FullScreenShell>
    );
  }

  if (state.status === "REJECTED") {
    return (
      <FullScreenShell>
        <MessageCircleWarning className="h-8 w-8 text-danger" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            তথ্য বাতিল হয়েছে
          </h2>
          {state.kyc?.rejectionReason && (
            <p className="max-w-sm rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
              {state.kyc.rejectionReason}
            </p>
          )}
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            সংশোধনের জন্য admin-এর সাথে সরাসরি যোগাযোগ করো — নিজে edit বা resubmit
            করার সুযোগ নেই।
          </p>
        </div>
      </FullScreenShell>
    );
  }

  // NOT_SUBMITTED
  return (
    <FullScreenShell wide={showForm}>
      {!showForm ? (
        <>
          <ShieldCheck className="h-8 w-8 text-signature" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="font-display text-xl font-bold text-foreground">
              Business verification প্রয়োজন
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              বিক্রি শুরু করার আগে তোমার dashboard খুলতে একবার business
              verification জমা দিতে হবে।
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="press mt-2 cursor-pointer rounded-full border-2 border-ink bg-signature px-6 py-3 text-sm font-bold text-primary-foreground shadow-hard"
          >
            Start verification
          </button>
        </>
      ) : (
        <div className="w-full">
          <h2 className="font-display mb-6 text-xl font-bold text-foreground">
            Business verification
          </h2>
          <KycForm onSubmitted={refresh} />
        </div>
      )}
    </FullScreenShell>
  );
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press cursor-pointer rounded-full border-2 border-ink bg-signature px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-hard"
    >
      আবার চেষ্টা করো
    </button>
  );
}

/** Close করা যায় না এমন full-screen overlay — dashboard-এর উপর বসে। */
function FullScreenShell({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 py-10 backdrop-blur-sm">
      <div
        className={`flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-ink bg-surface-elevated p-8 shadow-hard-lg ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <Logo />
        {children}
      </div>
    </div>
  );
}