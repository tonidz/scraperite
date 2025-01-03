"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/stripe/products";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  return (
    <Button
      onClick={() => {
        // TODO: Implement add to cart functionality
        console.log("Add to cart:", product.id);
      }}
      className="w-full"
    >
      Add to Cart
    </Button>
  );
}
