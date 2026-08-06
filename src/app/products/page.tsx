"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ProductCard } from "@/components/product/product-card";
import { ApiError } from "@/lib/api-client";
import { listProducts } from "@/services/product.service";
import type { ProductListItem, ProductListParams } from "@/types/product";

const SORT_OPTIONS: { label: string; value: NonNullable<ProductListParams["sortBy"]> }[] = [
  { label: "Newest", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Price", value: "price" },
  { label: "Stock", value: "stock" },
];

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<NonNullable<ProductListParams["sortBy"]>>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<ProductListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listProducts({
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
          sortBy,
          sortOrder,
        });
        if (cancelled) return;
        setItems(data.result);
        setMeta(data.meta);
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
  }, [page, search, sortBy, sortOrder]);

  function toggleSortOrder() {
    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Marketplace"
          title="Shop from verified creators"
          description="Every seller on Arthopay is identity-verified — browse products from real, trusted businesses."
        >
          <div className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-full border-2 border-ink bg-surface-elevated p-2 shadow-hard">
            <Search className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent py-2 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
              aria-label="Search products"
            />
          </div>
        </PageHero>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted-foreground">
              {meta.total} product{meta.total === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="cursor-pointer rounded-full border-2 border-ink bg-surface-elevated px-3 py-2 text-xs font-bold text-foreground outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleSortOrder}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-surface-elevated px-3 py-2 text-xs font-bold text-foreground"
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortOrder.toUpperCase()}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-6 rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          {loading ? (
            <p className="mt-16 text-center text-sm font-semibold text-muted-foreground">
              Loading products…
            </p>
          ) : items.length === 0 ? (
            <p className="mt-16 text-center text-sm font-semibold text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="cursor-pointer rounded-full border-2 border-ink bg-surface-elevated px-4 py-2 text-xs font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-bold text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="cursor-pointer rounded-full border-2 border-ink bg-surface-elevated px-4 py-2 text-xs font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
