"use client";

import { useState } from "react";
import { getStripe } from "@/lib/stripe/client";
import { useCart } from "./use-cart";
import { useToast } from "./use-toast";
import { useParams } from "next/navigation";

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const cart = useCart();
  const { toast } = useToast();
  const params = useParams();
  const lang = params.lang as string;

  const checkout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items,
          successUrl: `${window.location.origin}/${lang}/checkout/success`,
          cancelUrl: `${window.location.origin}/${lang}/checkout/cancel`,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) throw new Error(error);

      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkout,
    isLoading,
  };
}
