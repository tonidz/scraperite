"use client";

import { type StripeProduct } from "@/lib/stripe/products";
import { ProductCard } from "./product-card";

interface FeaturedProductProps {
  product: StripeProduct;
  dict: {
    shopNow: string;
  };
}

export function FeaturedProduct({ product, dict }: FeaturedProductProps) {
  return (
    <div className="transform scale-110 z-50 transition-transform duration-700 ease-in-out">
      <ProductCard product={product} dict={dict} />
    </div>
  );
}
