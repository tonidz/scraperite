"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "../language-switcher";
interface NavLinksProps {
  dict: {
    collections: string;
    brands: string;
    new: string;
    sales: string;
    demo: string;
  };
  className?: string;
}

export function NavLinks({ dict, className }: NavLinksProps) {
  const params = useParams();
  const lang = params.lang as "en" | "sv";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="hidden md:flex mx-6 items-center space-x-8 flex-1 justify-end">
      <Link
        href={`/${lang}/blade-guide`}
        className="text-sm font-medium transition-colors hover:text-gray-900"
      >
        {lang === "sv" ? "Bladguide" : "Blade Guide"}
      </Link>
      <Link
        href={`/${lang}/use-cases`}
        className="text-sm font-medium transition-colors hover:text-gray-900"
      >
        {lang === "sv" ? "Användning" : "Use Cases"}
      </Link>
      <Link
        href={`/${lang}/demo`}
        className="text-sm font-medium transition-colors hover:text-gray-900"
      >
        {lang === "sv" ? "Demo" : "Demo"}
      </Link>
      <LanguageSwitcher />
    </nav>
  );
}
