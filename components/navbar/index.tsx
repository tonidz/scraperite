"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NavLinks } from "./nav-links";
import { NavActions } from "./nav-actions";
import dynamic from "next/dynamic";
import { MobileMenu } from "./mobile-menu";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/get-dictionary";
import CartSheet from "../cart/cart-sheet";

interface NavbarProps {
  dict: {
    collections: string;
    brands: string;
    new: string;
    sales: string;
    demo: string;
  };
}

export function Navbar({ dict }: NavbarProps) {
  const params = useParams();
  const lang = params.lang as "en" | "sv";
  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-50 bg-[#FFE566]">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <MobileMenu dict={dict} />
          <Link href={`/${lang}`}>
            {/* <Image
              src="/logo.png"
              alt="Scraperite"
              width={40}
              height={40}
              className="rounded-full"
            />*/}
            <h1 className="text-2xl font-bold">MMCK</h1>
          </Link>
        </div>
        <NavLinks dict={dict} />
        <div className="ml-auto flex items-center gap-4">
          <NavActions />
        </div>
        <CartSheet />
      </div>
    </header>
  );
}
