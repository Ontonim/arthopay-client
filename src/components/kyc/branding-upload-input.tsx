"use client";

import { useRef, useState } from "react";
import { Loader2, Image as ImageIcon, RefreshCw } from "lucide-react";
import { uploadKycImage } from "@/lib/cloudinary-upload";
import type { KycUploadKind } from "@/app/actions/kyc/cloudinary-api";
import { cn } from "@/lib/utils";

interface BrandingUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  /** "business-logo" হলে square preview, "cover-image" হলে wide preview */
  kind: Extract<KycUploadKind, "business-logo" | "cover-image">;
}

const MAX_SIZE_MB = 5;

export function BrandingUploadInput({ label, value, onChange, error, kind }: BrandingUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isLogo = kind === "business-logo";

  async function handleFile(file: File) {
    setLocalError(null);

    if (!file.type.startsWith("image/")) {
      setLocalError("শুধু ছবি ফাইল দাও (jpg/png)");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`ছবির সাইজ সর্বোচ্চ ${MAX_SIZE_MB}MB হতে পারবে`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadKycImage(file, kind);
      onChange(url);
    } catch {
      setLocalError("Upload ব্যর্থ হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setUploading(false);
    }
  }

  const showError = error || localError;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-foreground">{label}</label>

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border-2 bg-surface-elevated p-3 shadow-hard-sm",
          showError ? "border-danger" : "border-ink"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className={cn(
              "shrink-0 border-2 border-ink object-cover",
              isLogo ? "h-16 w-16 rounded-full" : "h-14 w-20 rounded-lg"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center border-2 border-dashed border-ink/30 text-muted-foreground",
              isLogo ? "h-16 w-16 rounded-full" : "h-14 w-20 rounded-lg"
            )}
          >
            <ImageIcon className="h-5 w-5" />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground">
            {value ? "Uploaded — বদলাতে চাইলে নতুন ছবি দাও" : "jpg/png, সর্বোচ্চ 5MB"}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-fit cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink px-3.5 py-1.5 text-xs font-bold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Upload হচ্ছে…
              </>
            ) : value ? (
              <>
                <RefreshCw className="h-3.5 w-3.5" /> বদলাও
              </>
            ) : (
              "ছবি বাছাই করো"
            )}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {showError && <p className="text-xs font-semibold text-danger">{showError}</p>}
    </div>
  );
}