"use client";

import { useRef, useState } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { uploadKycImage } from "@/lib/cloudinary-upload";
import { cn } from "@/lib/utils";

interface ProductImagesUploadInputProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
  min?: number;
  max?: number;
}

const MAX_SIZE_MB = 5;

export function ProductImagesUploadInput({
  label,
  value,
  onChange,
  error,
  min = 3,
  max = 5,
}: ProductImagesUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const remainingSlots = max - value.length;

  async function handleFiles(files: FileList) {
    setLocalError(null);

    const picked = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setLocalError(`সর্বোচ্চ ${max}টা ছবি দেওয়া যাবে`);
    }

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        setLocalError("শুধু ছবি ফাইল দাও (jpg/png)");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`ছবির সাইজ সর্বোচ্চ ${MAX_SIZE_MB}MB হতে পারবে`);
        continue;
      }

      setUploading(true);
      try {
        const url = await uploadKycImage(file, "product-image");
        onChange([...value, url]);
      } catch {
        setLocalError("Upload ব্যর্থ হয়েছে, আবার চেষ্টা করো।");
      } finally {
        setUploading(false);
      }
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const showError = error || localError;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-foreground">{label}</label>
        <span className="text-xs font-semibold text-muted-foreground">
          {value.length}/{max}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-wrap gap-3 rounded-2xl border-2 bg-surface-elevated p-3 shadow-hard-sm",
          showError ? "border-danger" : "border-ink"
        )}
      >
        {value.map((url, i) => (
          <div key={url + i} className="relative h-20 w-20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Product ${i + 1}`}
              className="h-20 w-20 rounded-lg border-2 border-ink object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-surface-elevated text-foreground shadow-hard-sm"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink/30 text-muted-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-bold">যোগ করো</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="text-xs font-semibold text-muted-foreground">
        কমপক্ষে {min}টা, সর্বোচ্চ {max}টা প্রোডাক্ট ছবি দাও (jpg/png, প্রতিটা সর্বোচ্চ {MAX_SIZE_MB}MB)
      </p>

      {showError && <p className="text-xs font-semibold text-danger">{showError}</p>}
    </div>
  );
}