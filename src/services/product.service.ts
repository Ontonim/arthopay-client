import { apiRequest } from "@/lib/api-client";
import type {
  Product,
  ProductListParams,
  ProductListResponseData,
  ProductUpdatePayload,
} from "@/types/product";

/**
 * ⚠️ ASSUMED ENDPOINTS — no Product Module doc exists yet. Paths below
 * follow the same base pattern as the confirmed modules (/auth, /kyc),
 * i.e. /products. Confirm with backend and fix if the real paths differ
 * (e.g. nested under /seller/products, or /store/:username/products).
 */

/** GET /products — public, paginated list */
export function listProducts(params: ProductListParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.search) search.set("search", params.search);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  if (params.seller) search.set("seller", params.seller);

  const qs = search.toString();
  return apiRequest<ProductListResponseData>(`/products${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

/** GET /products/:id — public, full detail */
export function getProductById(id: string) {
  return apiRequest<Product>(`/products/${id}`, { method: "GET" });
}

/** PATCH /products/:id — 🔒 owner seller or admin */
export function updateProduct(id: string, payload: ProductUpdatePayload, accessToken: string) {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PATCH",
    body: payload,
    accessToken,
  });
}

/** DELETE /products/:id — 🔒 owner seller or admin */
export function deleteProduct(id: string, accessToken: string) {
  return apiRequest<null>(`/products/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
