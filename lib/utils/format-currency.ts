export function formatCurrency(amount: number | null): string {
  if (!amount) return "0 kr";

  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
