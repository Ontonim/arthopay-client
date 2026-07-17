"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    detail: "support@arthopay.com",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    detail: "Available 10am–7pm, Sat–Thu",
  },
  {
    icon: MapPin,
    title: "Based in",
    detail: "Dhaka, Bangladesh",
  },
];

export default function ContactPage() {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (values.name.trim().length < 2) next.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (values.message.trim().length < 10) {
      next.message = "Tell us a bit more (10+ characters)";
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
      setSent(true);
    }, 900);
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Get in touch"
          title="We're here to help"
          description="Questions about your page, a payout, or just want to say hi? Send us a message."
        />

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col gap-4">
              {CHANNELS.map((channel) => (
                <div
                  key={channel.title}
                  className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-surface-elevated p-5 shadow-hard-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-signature">
                    <channel.icon className="h-5.5 w-5.5 text-primary-foreground" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">
                      {channel.title}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {channel.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-ink bg-surface-elevated p-6 shadow-hard sm:p-10">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-signature">
                    <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Message sent!
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Thanks for reaching out — our team will reply to{" "}
                    <span className="font-semibold text-foreground">
                      {values.email}
                    </span>{" "}
                    within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <AuthInput
                    label="Your name"
                    name="name"
                    autoComplete="name"
                    placeholder="Farhan Ahmed"
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
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
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-bold text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="How can we help?"
                      value={values.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className="w-full resize-none rounded-2xl border-2 border-ink bg-surface-elevated px-4 py-3 text-sm font-semibold text-foreground shadow-hard-sm outline-none placeholder:text-muted-foreground/50 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-hard"
                    />
                    {errors.message && (
                      <p className="text-xs font-semibold text-danger">{errors.message}</p>
                    )}
                  </div>

                  <AuthButton loading={loading} className="mt-2">
                    {loading ? "Sending…" : "Send message"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </AuthButton>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
