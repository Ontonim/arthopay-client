/**
 * ⚠️ ASSUMED SHAPE — there is no Product Module doc yet (unlike Auth and
 * KYC, which we have real docs for). Everything in this file is a
 * reasonable guess modeled after the KYC module's conventions
 * (same response envelope, same pagination/meta shape, same
 * search/sort/filter query param names).
 *
 * When the real Product API docs show up, diff this file against them
 * and fix whatever doesn't match — field names, required/optional-ness,
 * and the exact endpoint paths in product.service.ts are all guesses.
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
  // Guessing "discountPrice" exists since it's common for storefronts —
  // confirm with backend, remove if it doesn't.
  discountPrice?: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
  seller: ProductSellerRef;
  createdAt: string;
  updatedAt: string;
}

/** Lighter shape for list rows — assumed identical to the full record for now. */
export type ProductListItem = Product;

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  // Filter to one seller's products — needed for a seller's "My Products" view.
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

/** PATCH /products/:id body — all fields optional (partial update). */
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
