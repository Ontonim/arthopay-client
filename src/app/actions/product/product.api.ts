"use server";

import { universalApi, type ApiResult } from "../universal-api/universal-api";

/**
 * ⚠️ ASSUMED ENDPOINTS — কোনো Product Module doc নেই এখনো (auth/kyc-এর মতো
 * confirmed doc নেই)। এখানকার path/shape সব পুরোনো `product.service.ts` থেকে
 * হুবহু বজায় রাখা হয়েছে — `/products` base ধরে অনুমান করা। Real doc এলে
 * fields/paths মিলিয়ে ঠিক করে নিও।
 */

export interface ProductSellerRef {
  _id: string;
  businessName?: string;
  businessUsername?: string;
  profileImage?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
  seller: ProductSellerRef;
  createdAt: string;
  updatedAt: string;
}

export type ProductListItem = Product;

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  seller?: string;
}

export interface ProductListResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  result: ProductListItem[];
}

export type ProductUpdatePayload = Partial<{
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
}>;

// GET /products — public, paginated list
export async function listProductsAction(
  params: ProductListParams = {}
): Promise<ApiResult<ProductListResponseData>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.search) search.set("search", params.search);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  if (params.seller) search.set("seller", params.seller);

  const qs = search.toString();
  return universalApi<ProductListResponseData>({
    endpoint: `/products${qs ? `?${qs}` : ""}`,
    method: "GET",
    requireAuth: false,
  });
}

// GET /products/:id — public, full detail
export async function getProductByIdAction(id: string): Promise<ApiResult<Product>> {
  return universalApi<Product>({
    endpoint: `/products/${id}`,
    method: "GET",
    requireAuth: false,
  });
}

// PATCH /products/:id — 🔒 owner seller or admin
export async function updateProductAction(
  id: string,
  payload: ProductUpdatePayload
): Promise<ApiResult<Product>> {
  return universalApi<Product>({
    endpoint: `/products/${id}`,
    method: "PATCH",
    body: payload,
    requireAuth: true,
  });
}

// DELETE /products/:id — 🔒 owner seller or admin
export async function deleteProductAction(id: string): Promise<ApiResult<null>> {
  return universalApi<null>({
    endpoint: `/products/${id}`,
    method: "DELETE",
    requireAuth: true,
  });
}
