import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password — Arthopay",
  description: "Get a one-time code to reset your Arthopay account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
