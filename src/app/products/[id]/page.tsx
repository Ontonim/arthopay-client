import type { Metadata } from "next";
import { ProductDetail } from "@/components/product/product-detail";

export const metadata: Metadata = {
  title: "Product — Arthopay",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
