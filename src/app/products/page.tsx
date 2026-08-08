import type { Metadata } from "next";
import { ProductList } from "@/components/product/product-list";

export const metadata: Metadata = {
  title: "Shop — Arthopay",
  description: "Browse products from identity-verified creators and sellers on Arthopay.",
};

export default function ProductsPage() {
  return <ProductList />;
}
