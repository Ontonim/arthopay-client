"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AtSign, Mail, User } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthButton } from "@/components/auth/auth-button";
import { GoogleButton } from "@/components/auth/google-button";

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (values.name.trim().length < 2) {
      next.name = "Enter your full name";
    }
    if (!/^[a-z0-9_.]{3,20}$/i.test(values.username)) {
      next.username = "3-20 characters, letters, numbers, . or _";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (values.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    setErrors(next);
    setAgreedError(!agreed);
    return Object.keys(next).length === 0 && agreed;
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
        <AuthInput
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Farhan Ahmed"
          icon={<User className="h-4 w-4" />}
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />

        <AuthInput
          label="Username"
          name="username"
          autoComplete="off"
          placeholder="farhan.codes"
          icon={<AtSign className="h-4 w-4" />}
          value={values.username}
          onChange={(e) =>
            handleChange("username", e.target.value.replace(/\s/g, ""))
          }
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

        <AuthPasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
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
