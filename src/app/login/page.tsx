"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthButton } from "@/components/auth/auth-button";
import { GoogleButton } from "@/components/auth/google-button";

interface FormState {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (values.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 900);
  }

  return (
    <AuthShell
      panelTitle="Your fans are waiting to say thanks."
      panelDescription="Log back in to manage your page, track support, and withdraw your earnings — all in one place."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Welcome back
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Log in to Arthopay
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          New here?{" "}
          <Link
            href="/register"
            className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
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
        />

        <div className="flex flex-col gap-1.5">
          <AuthPasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
          />
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-2 border-ink accent-signature"
              />
              Remember me
            </label>
            <Link
              href="#"
              className="text-xs font-bold text-signature-dark underline decoration-2 underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Logging in…" : "Log in"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>

        <div className="my-1 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/15" />
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Or
          </span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>

        <GoogleButton label="Continue with Google" />
      </form>
    </AuthShell>
  );
}
