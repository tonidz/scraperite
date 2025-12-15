"use client";

import { ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export function NavActions() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const { isAuthenticated, refreshAuth } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Trigger animation when items are added
  useEffect(() => {
    if (totalItems > prevItemCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevItemCount(totalItems);
  }, [totalItems, prevItemCount]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}`);
  };

  return (
    <div className="flex items-center gap-x-4">
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cart.toggleCart()}
          className="bg-white rounded-full w-10 h-10 relative"
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            >
              <motion.span
                key={totalItems}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {totalItems}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple effect when item is added */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 bg-red-500 rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full w-10 h-10"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/${lang}/orders`)}>
              {lang === "sv" ? "Mina Beställningar" : "My Orders"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/${lang}/welcome`)}>
              {lang === "sv" ? "Välkommen" : "Welcome"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/${lang}/posts`)}>
              {lang === "sv" ? "Inlägg" : "Posts"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              {lang === "sv" ? "Logga ut" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${lang}/login`)}
          className="bg-white rounded-full w-10 h-10"
        >
          <User className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
