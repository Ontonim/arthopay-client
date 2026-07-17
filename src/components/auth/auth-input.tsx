import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  rightSlot?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, rightSlot, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-foreground"
        >
          {label}
        </label>
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-2xl border-2 bg-surface-elevated px-4 py-3 shadow-hard-sm transition-[transform,box-shadow] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-hard",
            error ? "border-danger" : "border-ink",
          )}
        >
          {icon && (
            <span className="shrink-0 text-muted-foreground">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50",
              className,
            )}
            {...props}
          />
          {rightSlot}
        </div>
        {error && (
          <p className="text-xs font-semibold text-danger">{error}</p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
