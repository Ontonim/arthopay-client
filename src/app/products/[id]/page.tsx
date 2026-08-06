"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Package, Pencil, Store, Trash2 } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ZoomableImage } from "@/components/kyc/image-lightbox";
import { ProductEditForm } from "@/components/product/product-edit-form";
import { ApiError } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import { deleteProduct, getProductById } from "@/services/product.service";
import { useAuth } from "@/providers/AuthProvider";
import type { Product } from "@/types/product";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, getValidAccessToken } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (cancelled) return;
        setProduct(data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ⚠️ Assumption: product.seller._id refers to the same id as the logged-in
  // user's _id. That may well be wrong — the KYC docs suggest a business
  // profile can be a separate document from the User document. Confirm
  // with backend once the Product docs exist.
  const isOwner = Boolean(user && product && user._id === product.seller._id);

  async function openEdit() {
    setDeleteError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new ApiError("লগইন সেশন শেষ হয়ে গেছে, আবার লগইন করো।", 401);
      setEditToken(token);
      setShowEdit(true);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new ApiError("লগইন সেশন শেষ হয়ে গেছে, আবার লগইন করো।", 401);
      await deleteProduct(product._id, token);
      router.push("/products");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করো।");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1 px-5 py-24 text-center text-muted-foreground">Loading…</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1 px-5 py-24 text-center">
          <p className="text-sm font-semibold text-danger">{error ?? "Product not found"}</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm font-bold text-signature-dark underline"
          >
            Back to products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount =
    typeof product.discountPrice === "number" && product.discountPrice < product.price;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <Link
            href="/products"
            className="mb-6 flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-ink bg-cream">
                {product.images[activeImage] ? (
                  <ZoomableImage
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                        i === activeImage ? "border-signature" : "border-ink/20"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN thumbnail */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="w-fit rounded-full border-2 border-ink bg-signature-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                  {product.category}
                </span>
                <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-base font-semibold text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                {product.stock > 0 ? (
                  <span className="font-semibold text-foreground">{product.stock} in stock</span>
                ) : (
                  <span className="font-semibold text-danger">Out of stock</span>
                )}
              </div>

              <p className="leading-relaxed text-muted-foreground">{product.description}</p>

              {product.seller.businessUsername && (
                <Link
                  href={`/store/${product.seller.businessUsername}`}
                  className="flex w-fit items-center gap-2 rounded-2xl border-2 border-ink bg-surface-elevated px-4 py-3 shadow-hard-sm"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">
                    {product.seller.businessName ?? product.seller.businessUsername}
                  </span>
                </Link>
              )}

              {/* Owner-only management actions */}
              {isOwner && (
                <div className="mt-2 flex flex-col gap-2">
                  {deleteError && (
                    <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
                      {deleteError}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={openEdit}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-surface-elevated py-2.5 text-sm font-bold text-foreground shadow-hard-sm"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-danger bg-danger/10 py-2.5 text-sm font-bold text-danger disabled:opacity-70"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showEdit && product && editToken && (
        <ProductEditForm
          product={product}
          accessToken={editToken}
          onSaved={(updated) => {
            setProduct(updated);
            setShowEdit(false);
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
