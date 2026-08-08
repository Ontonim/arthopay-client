"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthButton } from "@/components/auth/auth-button";
import { resetPasswordAction, verifyResetOtpAction } from "@/app/action/auth/auth.api";

type Stage = "otp" | "password" | "done";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [stage, setStage] = useState<Stage>("otp");
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!/^\d{6}$/.test(otp)) {
      next.otp = "Enter the 6-digit code sent to your email";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const result = await verifyResetOtpAction({ email, otp });
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      setResetToken(result.data.resetToken);
      setStage("password");
    } catch {
      setFormError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (newPassword.length < 6) {
      next.newPassword = "Password must be at least 6 characters";
    }
    if (confirmPassword !== newPassword) {
      next.confirmPassword = "Passwords don't match";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const result = await resetPasswordAction({
        resetToken,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      setStage("done");
    } catch {
      setFormError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  if (stage === "done") {
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

  if (stage === "password") {
    return (
      <AuthShell
        panelTitle="Almost there."
        panelDescription="Choose a new password to get back into your account."
      >
        <div className="flex flex-col gap-2">
          <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Reset password
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Set a new password
          </h1>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 flex flex-col gap-5" noValidate>
          {formError && (
            <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
              {formError}
            </p>
          )}

          <AuthPasswordInput
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((p) => ({ ...p, newPassword: "" }));
            }}
            error={errors.newPassword}
          />

          <AuthPasswordInput
            label="Confirm new password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((p) => ({ ...p, confirmPassword: "" }));
            }}
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

  return (
    <AuthShell
      panelTitle="Almost there."
      panelDescription="Enter the code we sent you to confirm it's really you."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Reset password
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Enter your reset code
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

      <form onSubmit={handleVerifyOtp} className="mt-8 flex flex-col gap-5" noValidate>
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "" }));
          }}
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
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
            setErrors((p) => ({ ...p, otp: "" }));
          }}
          error={errors.otp}
        />

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Verifying…" : "Verify code"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
