import { stripe } from "./server";
import { CURRENCY, ALLOWED_COUNTRIES, SHIPPING_OPTIONS } from "./config";
import type { CartItem as StripeCartItem } from "@/types/stripe";
import type { Stripe } from "stripe";

interface CreateCheckoutSessionParams {
  items: StripeCartItem[];
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  items,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams) {
  if (!items?.length) {
    throw new Error("No items provided");
  }

  try {
    return stripe.checkout.sessions.create({
      payment_method_types: ["card"] as const,
      billing_address_collection: "required",
      line_items: items.map((item) => ({
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: [
          ...ALLOWED_COUNTRIES,
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: SHIPPING_OPTIONS.map((option) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: option.amount,
            currency: CURRENCY,
          },
          display_name: option.name,
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: option.estimatedDays.min,
            },
            maximum: {
              unit: "business_day",
              value: option.estimatedDays.max,
            },
          },
        },
      })),
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
