"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthButton } from "@/components/auth/auth-button";
import { ApiError } from "@/lib/api-client";
import { resetPassword } from "@/services/auth.service";

interface FormState {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [values, setValues] = useState<FormState>({
    email: emailFromQuery,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (!/^\d{4,6}$/.test(values.otp)) {
      next.otp = "Enter the OTP sent to your email";
    }
    if (values.newPassword.length < 8) {
      next.newPassword = "Password must be at least 8 characters";
    }
    if (values.confirmPassword !== values.newPassword) {
      next.confirmPassword = "Passwords don't match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      setDone(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।"
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell
        panelTitle="You're all set."
        panelDescription="Your password has been updated. Log in with your new password to get back to your page."
      >
        <div className="flex flex-col gap-4">
          <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Password reset
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Password updated
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            You can now log in with your new password.
          </p>
          <AuthButton onClick={() => router.push("/login")} className="mt-2">
            Go to login
            <ArrowRight className="h-4 w-4" />
          </AuthButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      panelTitle="Almost there."
      panelDescription="Enter the code we sent you and choose a new password to get back into your account."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Reset password
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Set a new password
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Didn&apos;t get a code?{" "}
          <Link
            href="/forgot-password"
            className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
          >
            Send again
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        {formError && (
          <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {formError}
          </p>
        )}

        <AuthInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          readOnly={Boolean(emailFromQuery)}
        />

        <AuthInput
          label="OTP code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit code"
          icon={<KeyRound className="h-4 w-4" />}
          value={values.otp}
          onChange={(e) => handleChange("otp", e.target.value.replace(/\D/g, ""))}
          error={errors.otp}
        />

        <AuthPasswordInput
          label="New password"
          name="newPassword"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          error={errors.newPassword}
        />

        <AuthPasswordInput
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          value={values.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Updating…" : "Reset password"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
