"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthInput } from "./auth-input";

interface AuthPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthPasswordInput = forwardRef<
  HTMLInputElement,
  AuthPasswordInputProps
>(({ label, error, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      ref={ref}
      label={label}
      error={error}
      type={visible ? "text" : "password"}
      icon={<Lock className="h-4 w-4" />}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      }
      {...props}
    />
  );
});

AuthPasswordInput.displayName = "AuthPasswordInput";
