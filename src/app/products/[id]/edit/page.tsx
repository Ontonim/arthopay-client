import type { Metadata } from "next";
import { ProductEditPage } from "@/components/product/product-edit-page";

export const metadata: Metadata = {
  title: "Edit product — Arthopay",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditPage id={id} />;
}
