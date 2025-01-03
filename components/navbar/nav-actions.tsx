"use client";

import { ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
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

export function NavActions() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const { isAuthenticated, refreshAuth } = useAuth();

  useEffect(() => {
    refreshAuth();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}`);
  };

  return (
    <div className="flex items-center gap-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => cart.toggleCart()}
        className="bg-white rounded-full w-10 h-10"
      >
        <ShoppingBag className="h-4 w-4" />
      </Button>

      {isAuthenticated && (
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
      )}
    </div>
  );
}
