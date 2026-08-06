/** ⚠️ Assumes BDT (৳) — confirm currency with backend once Product docs exist. */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}
