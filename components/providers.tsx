"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth/auth-provider";
import { CartProvider } from "./cart/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
