"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { AuthInput } from "@/components/auth/auth-input";
import { KycTextarea } from "@/components/kyc/kyc-textarea";
import { uploadImage } from "@/lib/upload";
import {
  updateProductAction,
  type Product,
  type ProductUpdatePayload,
} from "@/app/action/product/product.api";

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  isActive: boolean;
  existingImages: string[];
  newImages: File[];
}

export function ProductEditForm({
  product,
  onSaved,
  onClose,
}: {
  product: Product;
  onSaved: (updated: Product) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<FormState>({
    name: product.name,
    description: product.description,
    price: String(product.price),
    discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
    stock: String(product.stock),
    category: product.category,
    isActive: product.isActive,
    existingImages: product.images,
    newImages: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function removeExistingImage(url: string) {
    set(
      "existingImages",
      values.existingImages.filter((u) => u !== url)
    );
  }

  function addNewImages(fileList: FileList | null) {
    if (!fileList) return;
    set("newImages", [...values.newImages, ...Array.from(fileList)]);
  }

  function removeNewImage(index: number) {
    set(
      "newImages",
      values.newImages.filter((_, i) => i !== index)
    );
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (values.name.trim().length < 2) next.name = "Enter a product name";
    if (values.description.trim().length < 10) next.description = "Description is too short";

    const price = Number(values.price);
    if (!Number.isFinite(price) || price <= 0) next.price = "Enter a valid price";

    if (values.discountPrice) {
      const discount = Number(values.discountPrice);
      if (!Number.isFinite(discount) || discount < 0 || discount >= price) {
        next.discountPrice = "Discount price must be less than the regular price";
      }
    }

    const stock = Number(values.stock);
    if (!Number.isInteger(stock) || stock < 0) next.stock = "Enter a valid stock count";

    if (!values.category.trim()) next.category = "Enter a category";

    if (values.existingImages.length + values.newImages.length === 0) {
      next.existingImages = "At least one image is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setFormError(null);
    try {
      let uploadedUrls: string[] = [];
      if (values.newImages.length > 0) {
        // Same placeholder limitation as the KYC form — throws until
        // backend gives us a real upload endpoint.
        uploadedUrls = await Promise.all(values.newImages.map((f) => uploadImage(f)));
      }

      const payload: ProductUpdatePayload = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        stock: Number(values.stock),
        category: values.category.trim(),
        isActive: values.isActive,
        images: [...values.existingImages, ...uploadedUrls],
      };

      // accessToken আর manually পাঠাতে হচ্ছে না — updateProductAction নিজেই cookie থেকে token পড়ে
      const result = await updateProductAction(product._id, payload);
      if (!result.success) {
        if (result.errorSource?.length) {
          const fieldErrors: Partial<Record<keyof FormState, string>> = {};
          for (const e of result.errorSource) {
            if (e.path in values) {
              fieldErrors[e.path as keyof FormState] = e.message;
            }
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        setFormError(result.message);
        return;
      }
      onSaved(result.data);
    } catch {
      setFormError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Edit product"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[24px] border-2 border-ink bg-surface-elevated p-7 shadow-hard sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Edit product</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {formError && (
            <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
              {formError}
            </p>
          )}

          <AuthInput
            label="Name"
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
          <div className="grid grid-cols-2 gap-3">
            <AuthInput
              label="Price"
              name="price"
              type="number"
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              error={errors.price}
            />
            <AuthInput
              label="Discount price (optional)"
              name="discountPrice"
              type="number"
              value={values.discountPrice}
              onChange={(e) => set("discountPrice", e.target.value)}
              error={errors.discountPrice}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AuthInput
              label="Stock"
              name="stock"
              type="number"
              value={values.stock}
              onChange={(e) => set("stock", e.target.value)}
              error={errors.stock}
            />
            <AuthInput
              label="Category"
              name="category"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              error={errors.category}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 accent-signature"
            />
            <span className="text-sm font-semibold text-foreground">
              Listed (visible in the store)
            </span>
          </label>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Images</span>
            <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-ink bg-cream p-3">
              {values.existingImages.map((url) => (
                <div
                  key={url}
                  className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-ink/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN URL */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {values.newImages.map((file, i) => (
                <ImageThumbPreview
                  key={file.name + i}
                  file={file}
                  onRemove={() => removeNewImage(i)}
                />
              ))}
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink/30">
                <Plus className="h-5 w-5 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addNewImages(e.target.files)}
                />
              </label>
            </div>
            {errors.existingImages && (
              <p className="text-xs font-semibold text-danger">{errors.existingImages}</p>
            )}
            {values.newImages.length > 0 && (
              <p className="text-xs text-muted-foreground">
                New images will only upload once backend adds an image-upload endpoint.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 cursor-pointer rounded-full border-2 border-ink bg-cream py-2.5 text-sm font-bold text-foreground disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-signature py-2.5 text-sm font-bold text-primary-foreground shadow-hard disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageThumbPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-ink/20">
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
