"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AtSign, Mail, Phone, User } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthButton } from "@/components/auth/auth-button";
import { GoogleButton } from "@/components/auth/google-button";
import { registerAction } from "@/app/action/auth/auth.api";

interface FormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (values.firstName.trim().length < 2) {
      next.firstName = "Enter your first name";
    }
    if (values.lastName.trim().length < 2) {
      next.lastName = "Enter your last name";
    }
    if (!/^[a-z0-9_]{3,30}$/i.test(values.username)) {
      next.username = "3-30 characters, letters, numbers, or underscore";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    // Bangladeshi mobile format — 01[3-9]XXXXXXXX (11 digits), matches the backend rule.
    if (!/^01[3-9]\d{8}$/.test(values.mobile)) {
      next.mobile = "Enter a valid mobile number, e.g. 01712345678";
    }
    if (values.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    if (values.confirmPassword !== values.password) {
      next.confirmPassword = "Passwords don't match";
    }
    setErrors(next);
    setAgreedError(!agreed);
    return Object.keys(next).length === 0 && agreed;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await registerAction({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        mobile: values.mobile.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "SELLER", // এই page দিয়ে creator/seller হিসেবে signup হয়
      });

      if (!result.success) {
        if (result.errorSource?.length) {
          const fieldErrors: Partial<FormState> = {};
          for (const e of result.errorSource) {
            if (e.path in values) {
              fieldErrors[e.path as keyof FormState] = e.message;
            }
          }
          setErrors(fieldErrors);
        }
        setFormError(result.message);
        return;
      }

      // Backend requires OTP email verification before login works — send them there.
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch {
      setFormError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      panelTitle="Turn your fans into superfans."
      panelDescription="Create your page in minutes, share it anywhere, and start receiving support from the people who love what you make."
    >
      <div className="flex flex-col gap-2">
        <span className="w-fit -rotate-1 rounded-full border-2 border-ink bg-signature-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          Get started — it&apos;s free
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create your account
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Already have a page?{" "}
          <Link
            href="/login"
            className="font-bold text-signature-dark underline decoration-2 underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        {formError && (
          <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {formError}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="First name"
            name="firstName"
            autoComplete="given-name"
            placeholder="Farhan"
            icon={<User className="h-4 w-4" />}
            value={values.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
          />
          <AuthInput
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Ahmed"
            value={values.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
          />
        </div>

        <AuthInput
          label="Username"
          name="username"
          autoComplete="off"
          placeholder="farhan_codes"
          icon={<AtSign className="h-4 w-4" />}
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value.replace(/\s/g, ""))}
          error={errors.username}
        />

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

        <AuthInput
          label="Mobile number"
          name="mobile"
          type="tel"
          autoComplete="tel"
          placeholder="01712345678"
          icon={<Phone className="h-4 w-4" />}
          value={values.mobile}
          onChange={(e) => handleChange("mobile", e.target.value.replace(/\s/g, ""))}
          error={errors.mobile}
        />

        <AuthPasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
        />

        <AuthPasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-type your password"
          value={values.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-2.5 text-xs font-semibold leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setAgreedError(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-2 border-ink accent-signature"
            />
            I agree to Arthopay&apos;s{" "}
            <Link href="#" className="font-bold text-foreground underline decoration-2 underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-bold text-foreground underline decoration-2 underline-offset-2">
              Privacy Policy
            </Link>
          </label>
          {agreedError && (
            <p className="text-xs font-semibold text-danger">
              Please accept the terms to continue
            </p>
          )}
        </div>

        <AuthButton loading={loading} className="mt-2">
          {loading ? "Creating your page…" : "Create account"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </AuthButton>

        <div className="my-1 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/15" />
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Or
          </span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>

        <GoogleButton label="Sign up with Google" />
      </form>
    </AuthShell>
  );
}
