"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { ApiError } from "@/lib/api-client";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      panelTitle="Locked out? Let's fix that."
      panelDescription="Enter the email on your account and we'll send you a one-time code to reset your password."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Reset password
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Forgot your password?
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Remembered it after all?{" "}
          <Link
            href="/login"
            className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        {error && (
          <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {error}
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
        />

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Sending code…" : "Send reset code"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
