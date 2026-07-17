export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="press flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-2 border-ink bg-surface-elevated py-3.5 text-sm font-bold text-foreground shadow-hard-sm"
    >
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.89c2.28-2.1 3.53-5.2 3.53-8.8z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.89-2.98c-1.08.72-2.45 1.15-4.04 1.15-3.11 0-5.75-2.1-6.69-4.92H1.28v3.07C3.25 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.31 14.34c-.24-.72-.38-1.49-.38-2.34s.14-1.62.38-2.34V6.59H1.28A11.96 11.96 0 000 12c0 1.93.47 3.76 1.28 5.41l4.03-3.07z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.59l4.03 3.07C6.25 6.85 8.89 4.75 12 4.75z"
        />
      </svg>
      {label}
    </button>
  );
}
