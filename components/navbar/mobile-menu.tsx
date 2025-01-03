"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LanguageSwitcher } from "../language-switcher";

interface MobileMenuProps {
  dict: {
    collections: string;
    brands: string;
    new: string;
    sales: string;
    demo: string;
  };
}

export function MobileMenu({ dict }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const lang = params.lang as "en" | "sv";

  const links = [
    {
      href: `/${lang}/blade-guide`,
      label: lang === "sv" ? "Bladguide" : "Blade Guide",
    },
    {
      href: `/${lang}/use-cases`,
      label: lang === "sv" ? "Användningsfall" : "Use Cases",
    },
    { href: `/${lang}/demo`, label: dict.demo },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <span className="font-bold text-xl">ScrapeRite</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg py-2 hover:text-gray-900 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
