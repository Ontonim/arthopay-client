import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: ProductListItem }) {
  const hasDiscount =
    typeof product.discountPrice === "number" && product.discountPrice < product.price;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-surface-elevated shadow-hard transition-transform duration-200 hover:-translate-y-1.5"
    >
      <div className="aspect-square w-full overflow-hidden border-b-2 border-ink bg-cream">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN URL
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="line-clamp-1 font-display font-bold text-foreground">{product.name}</p>
        {product.seller.businessName && (
          <p className="text-xs font-medium text-muted-foreground">
            {product.seller.businessName}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <span className="font-bold text-foreground">
            {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-semibold text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.stock <= 0 && (
          <span className="w-fit rounded-full border-2 border-danger bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
            Out of stock
          </span>
        )}
      </div>
    </Link>
  );
}
