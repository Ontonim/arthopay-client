"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { resendOtpAction, verifyEmailAction } from "@/app/actions/auth/auth-api";

const RESEND_COOLDOWN_SECONDS = 60; // doc: resend-otp rate limit ৬০ সেকেন্ড

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(emailFromQuery ? RESEND_COOLDOWN_SECONDS : 0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    // doc: OTP ঠিক ৬ অক্ষর
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code sent to your email");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmailAction({ email, otp });
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push("/login?verified=1");
    } catch {
      setError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address first");
      return;
    }

    setResending(true);
    try {
      const result = await resendOtpAction({ email });
      if (!result.success) {
        // doc: 429 হলে message-এ কতক্ষণ বাকি সেটা লেখা থাকে — সরাসরি সেটাই দেখাই
        setError(result.message);
        return;
      }
      setNotice("A new OTP has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell
      panelTitle="One quick check before you start."
      panelDescription="We sent a one-time code to your email to confirm it's really you — this keeps your page and payouts secure."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Verify your email
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Enter your OTP
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {emailFromQuery
            ? `We've sent a code to ${emailFromQuery}.`
            : "Enter your email and the code we sent you."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        {error && (
          <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-xl border-2 border-ink bg-signature-soft px-3.5 py-2.5 text-sm font-semibold text-accent-foreground">
            {notice}
          </p>
        )}

        <AuthInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={Boolean(emailFromQuery)}
        />

        <AuthInput
          label="OTP code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit code"
          icon={<KeyRound className="h-4 w-4" />}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Verifying…" : "Verify email"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          Didn&apos;t get a code?{" "}
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="cursor-pointer font-bold text-signature-dark underline decoration-2 underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Sending…" : "Resend OTP"}
            </button>
          )}
        </p>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
          >
            Go back
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
