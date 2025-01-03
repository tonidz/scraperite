"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function NavLinks() {
  const params = useParams();
  const lang = params.lang as string;
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
    <nav className="mx-6 flex items-center space-x-8 flex-1 justify-end">
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
        {lang === "sv" ? "Användningsfall" : "Use Cases"}
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
