export const CURRENCY = "SEK";
export const ALLOWED_COUNTRIES = ["SE", "NO", "DK", "FI"] as const;

export const SHIPPING_OPTIONS = [
  {
    name: "Standard shipping",
    amount: 4900,
    estimatedDays: {
      min: 3,
      max: 5,
    },
  },
] as const;

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
