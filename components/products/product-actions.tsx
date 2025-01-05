"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { type StripeProduct } from "@/lib/stripe/products";
import { formatCurrency } from "@/lib/stripe/config";

interface ProductActionsProps {
  product: StripeProduct;
  dict: {
    shopNow: string;
  };
}

export function ProductActions({ product, dict }: ProductActionsProps) {
  const cart = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product.defaultPrice) return;

    cart.addItem({
      id: product.id.toString(),
      name: product.name,
      description: product.description || "",
      price: product.defaultPrice.unitAmount / 100,
      priceId: product.defaultPrice.id,
      image: product.images[0],
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!product.defaultPrice) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-xl font-bold">
        {formatCurrency(product.defaultPrice.unitAmount / 100)}
      </span>
      <Button onClick={handleAddToCart} className="rounded-full px-8">
        {dict.shopNow}
      </Button>
    </div>
  );
}
