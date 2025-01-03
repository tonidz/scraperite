"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { type StripeProduct } from "@/lib/stripe/products";
import { formatCurrency } from "@/lib/stripe/config";
import { motion } from "framer-motion";
import { PaymentOptions } from "./payment-options";
import { SocialShare } from "./social-share";

interface ProductDetailsProps {
  product: StripeProduct;
  metadata: {
    title: string;
    description: string;
    features?: string[];
    specifications?: Record<string, string>;
  };
  dict: {
    shopNow: string;
    securePayment: string;
    paymentMethods: string;
    securityNote: string;
    share: string;
    copied: string;
  };
}

export function ProductDetails({
  product,
  metadata,
  dict,
}: ProductDetailsProps) {
  const cart = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product.defaultPrice) return;

    cart.addItem({
      id: product.id,
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
    <div className="flex flex-col items-center md:grid md:grid-cols-2 gap-12">
      <motion.div
        className="relative w-full max-w-[400px] aspect-square bg-white rounded-lg p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-lg text-gray-600">{product.description}</p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">
            {formatCurrency(product.defaultPrice.unitAmount / 100)}
          </span>
          <Button onClick={handleAddToCart} className="rounded-full px-8">
            {dict.shopNow}
          </Button>
        </div>

        <PaymentOptions dict={dict} />
        <SocialShare
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.name}
          dict={dict}
        />
      </motion.div>

      <div className="w-full md:col-span-2 prose max-w-none mb-16">
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">{metadata.title}</h2>
          <div className="whitespace-pre-line text-gray-700">
            {metadata.description}
          </div>
          {metadata.features && metadata.features.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                {metadata.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </>
          )}
          {metadata.specifications &&
            Object.keys(metadata.specifications).length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Specifications
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  {Object.entries(metadata.specifications).map(
                    ([key, value], index) => (
                      <li key={index}>
                        <strong>{key}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
        </motion.div>
      </div>
    </div>
  );
}
