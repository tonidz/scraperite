import { getDictionary } from "@/i18n/get-dictionary";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { NavLinks } from "./nav-links";
import { NavActions } from "./nav-actions";
import { CartSheet } from "../cart/cart-sheet";
import { MobileMenu } from "./mobile-menu";
import type { ValidLocale } from "@/i18n/config";

export async function Navbar({ lang }: { lang: ValidLocale }) {
  const dict = await getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 bg-[#FFE566]">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <MobileMenu dict={dict.nav} />
          <Link href={`/${lang}`} className="flex items-center gap-x-2">
            <ShoppingBag className="h-8 w-8" />
            <span className="font-bold text-xl">ScrapeRite</span>
          </Link>
        </div>
        <div className="flex-1">
          <NavLinks dict={dict.nav} />
        </div>
        <div className="flex items-center gap-4">
          <NavActions />
        </div>
      </div>
      <CartSheet />
    </header>
  );
}
