"use client";

import { use, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { AuthInput } from "@/components/auth/auth-input";
import { KycTextarea } from "@/components/kyc/kyc-textarea";
import { ApiError } from "@/lib/api-client";
import { uploadImages } from "@/lib/upload";
import { getProductById, updateProduct } from "@/services/product.service";
import { useAuth } from "@/providers/AuthProvider";
import type { Product, ProductUpdatePayload } from "@/types/product";

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  isActive: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, getValidAccessToken, isInitializing } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [values, setValues] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Existing images kept as URL strings; newly picked files get uploaded on submit.
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadStage, setUploadStage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getProductById(id);
        if (cancelled) return;
        setProduct(data);
        setValues({
          name: data.name,
          description: data.description,
          price: String(data.price),
          discountPrice: data.discountPrice != null ? String(data.discountPrice) : "",
          stock: String(data.stock),
          category: data.category,
          isActive: data.isActive,
        });
        setExistingImages(data.images);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ⚠️ Same ownership assumption flagged on the detail page — confirm once
  // Product docs exist whether `seller._id` really maps to the User id.
  const isOwner = Boolean(user && product && user._id === product.seller._id);

  const newImagePreviews = useMemo(
    () => newImages.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [newImages]
  );
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [newImagePreviews]);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function validate(v: FormState) {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (v.name.trim().length < 2) next.name = "Enter a product name";
    if (v.description.trim().length < 10) next.description = "At least 10 characters";
    const price = Number(v.price);
    if (!Number.isFinite(price) || price <= 0) next.price = "Enter a valid price";
    if (v.discountPrice) {
      const dp = Number(v.discountPrice);
      if (!Number.isFinite(dp) || dp < 0 || dp >= price) {
        next.discountPrice = "Must be less than the regular price";
      }
    }
    const stock = Number(v.stock);
    if (!Number.isInteger(stock) || stock < 0) next.stock = "Enter a valid stock count";
    if (!v.category.trim()) next.category = "Enter a category";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;

    const stepErrors = validate(values);
    if (existingImages.length + newImages.length === 0) {
      setFormError("Add at least one product image");
    }
    if (Object.keys(stepErrors).length > 0 || existingImages.length + newImages.length === 0) {
      setErrors(stepErrors);
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new ApiError("লগইন সেশন শেষ হয়ে গেছে, আবার লগইন করো।", 401);

      let finalImages = existingImages;
      if (newImages.length > 0) {
        setUploadStage("Uploading new images…");
        const uploaded = await uploadImages(newImages);
        finalImages = [...existingImages, ...uploaded];
        setUploadStage(null);
      }

      const payload: ProductUpdatePayload = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        stock: Number(values.stock),
        category: values.category.trim(),
        images: finalImages,
        isActive: values.isActive,
      };

      await updateProduct(id, payload, token);
      router.push(`/products/${id}`);
    } catch (err) {
      setUploadStage(null);
      if (err instanceof ApiError) {
        if (err.errorSource?.length) {
          const fieldErrors: Partial<Record<keyof FormState, string>> = {};
          for (const fe of err.errorSource) {
            if (fe.path in (values ?? {})) {
              fieldErrors[fe.path as keyof FormState] = fe.message;
            }
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        setFormError(err.message);
      } else {
        setFormError(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="px-5 py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (loadError || !product || !values) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-sm font-semibold text-danger">{loadError ?? "Product not found"}</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-bold text-signature-dark underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (!isInitializing && !isOwner) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-sm font-semibold text-danger">
          You don&apos;t have permission to edit this product.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Link
        href={`/products/${id}`}
        className="mb-6 flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to product
      </Link>

      <h1 className="mb-6 font-display text-2xl font-bold text-foreground sm:text-3xl">
        Edit product
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {formError && (
          <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
            {formError}
          </p>
        )}

        <AuthInput
          label="Product name"
          name="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
        <KycTextarea
          label="Description"
          name="description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          error={errors.description}
        />
        <AuthInput
          label="Category"
          name="category"
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
          error={errors.category}
        />

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="Price"
            name="price"
            type="number"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            error={errors.price}
          />
          <AuthInput
            label="Discount price (optional)"
            name="discountPrice"
            type="number"
            inputMode="decimal"
            value={values.discountPrice}
            onChange={(e) => set("discountPrice", e.target.value)}
            error={errors.discountPrice}
          />
        </div>

        <AuthInput
          label="Stock"
          name="stock"
          type="number"
          inputMode="numeric"
          value={values.stock}
          onChange={(e) => set("stock", e.target.value)}
          error={errors.stock}
        />

        <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="h-4 w-4 shrink-0 accent-signature"
          />
          <span className="text-sm text-foreground">
            Active (visible in the storefront and search)
          </span>
        </label>

        {/* Images */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-foreground">Product images</span>
          <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-ink bg-surface-elevated p-3 shadow-hard-sm">
            {existingImages.map((src, i) => (
              <div
                key={src + i}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN URL */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  aria-label="Remove image"
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-ink text-cream"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newImagePreviews.map((p, i) => (
              <div
                key={p.url}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-signature"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={p.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setNewImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  aria-label="Remove image"
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-ink text-cream"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink/30 bg-cream"
            >
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (!e.target.files) return;
                setNewImages((imgs) => [...imgs, ...Array.from(e.target.files ?? [])]);
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="press mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-signature py-3.5 text-sm font-bold text-primary-foreground shadow-hard disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploadStage ?? (saving ? "Saving…" : "Save changes")}
        </button>
      </form>
    </div>
  );
}
