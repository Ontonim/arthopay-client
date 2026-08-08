import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account — Arthopay",
  description: "Sign up to start receiving support from your fans on Arthopay.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}