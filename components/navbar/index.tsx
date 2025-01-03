"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { NavLinks } from "./nav-links";
import { NavActions } from "./nav-actions";
import { CartSheet } from "../cart/cart-sheet";
import { useParams } from "next/navigation";

export function Navbar() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <header className="sticky top-0 z-50 bg-[#FFE566]">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href={`/${lang}`} className="flex items-center gap-x-2">
          <ShoppingBag className="h-8 w-8" />
          <span className="font-bold text-xl">ScrapeRite</span>
        </Link>
        <NavLinks />
        <NavActions />
      </div>
      <CartSheet />
    </header>
  );
}
