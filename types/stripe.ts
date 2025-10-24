export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  defaultPrice: StripePrice | null;
  metadata: Record<string, string>;
}

export interface StripePrice {
  id: string;
  unitAmount: number;
  currency: string;
}

export interface CheckoutItem {
  priceId: string;
  quantity: number;
}
