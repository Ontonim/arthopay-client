"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMyKycAction, type KycRecord } from "@/app/actions/kyc/kyc-api";
import type { KycStatus } from "@/app/actions/auth/auth-api";

/**
 * KYC status fetch করে রাখা এই custom hook-এর একমাত্র দায়িত্ব — এটাকে
 * `KycGate` component থেকে আলাদা file-এ রাখা হয়েছে ইচ্ছাকৃতভাবে।
 *
 * React docs-এর "Fetching data" pattern-ই এখানে অনুসরণ করা হয়েছে —
 * mount হওয়ার সময় একবার fetch, আর race-condition এড়াতে `ignore` flag।
 * (https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
 * এটাই effect-এর বৈধ ব্যবহার — তাই নিচের একটা লাইনে lint rule disable
 * করা হয়েছে, পুরো ফাইলে না।
 */

export type KycGateState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready"; status: KycStatus; kyc: KycRecord | null };

export function useKycStatus() {
  const [state, setState] = useState<KycGateState>({ phase: "loading" });
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const result = await getMyKycAction();

    // এর মধ্যে যদি আরেকটা load() শুরু হয়ে যায় (যেমন দ্রুত refresh), পুরোনো
    // response এসে state overwrite করবে না।
    if (requestId !== requestIdRef.current) return;

    if (!result.success) {
      setState({ phase: "error", message: result.message });
      return;
    }
    setState({ phase: "ready", status: result.data.status, kyc: result.data.kyc });
  }, []);

  // Mount হওয়ার সময় একবার fetch — এটাই effect-এর সঠিক ব্যবহার (external API-এর
  // সাথে synchronize করা)। এখানে ব্যতিক্রম হিসেবে rule disable করা হলো।
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only fetch, React docs-এর "Fetching data" pattern
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setState({ phase: "loading" });
    load();
  }, [load]);

  return { state, refresh };
}