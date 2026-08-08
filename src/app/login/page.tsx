import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — Arthopay",
  description: "Log in to manage your Arthopay page, track support, and withdraw earnings.",
};

export default function LoginPage() {
  return <LoginForm />;
}
