"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/cart-provider";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

// Big Gripper product definition
const BIG_GRIPPER_PRODUCT = {
  id: "big-gripper-hero",
  name: "Big Gripper",
  description: "Professional plastic scraper - Bra grepp, bra tryck",
  price: 299, // Price in SEK
  priceId: "price_big_gripper", // Update with actual Stripe price ID
  image: "/bred.png",
};

interface HeroContentProps {
  dict: {
    title: string;
    description: string;
    button: string;
    stats: {
      monthlyTraffic: string;
      happyCustomers: string;
    };
  };
}

export function HeroContent({ dict }: HeroContentProps) {
  const params = useParams();
  const lang = params.lang as string;
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    cart.addItem({
      ...BIG_GRIPPER_PRODUCT,
      quantity: 1,
    });

    setIsAdded(true);

    // Reset button state after animation
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center pt-4 md:pt-40 pb-8 md:pb-0">
      {/* Mobile: Content near top below image, Desktop: Content on left */}
      <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col justify-start md:justify-center space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="p-4 sm:p-6 md:p-0"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black md:text-white md:drop-shadow-lg">
            Big
            <br />
            Gripper
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-light mt-3 sm:mt-4 tracking-wide text-black/80 md:text-white md:drop-shadow-md md:opacity-90">
            Bra grepp, bra tryck
          </h2>

          <p className="text-sm sm:text-sm md:text-base mt-4 sm:mt-6 max-w-sm font-medium text-black/70 md:text-white md:drop-shadow-md md:opacity-90 leading-relaxed">
            {dict.description}
          </p>

          <div className="mt-6 sm:mt-8">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                className={`
                  relative overflow-hidden rounded-none px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider transition-all shadow-lg
                  ${
                    isAdded
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700 hover:scale-105"
                  }
                  text-white
                `}
                onClick={handleAddToCart}
                disabled={isAdded}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5" />
                      {lang === "sv" ? "Tillagd!" : "Added!"}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="buy"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {lang === "sv" ? "Köp nu" : "Buy now"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Center area kept empty - image displays in canvas behind */}
      <div className="flex-1 hidden md:block"></div>
    </div>
  );
}
