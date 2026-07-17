import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function AuthButton({
  loading,
  children,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        "press flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-signature py-3.5 text-sm font-bold text-primary-foreground shadow-hard disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
