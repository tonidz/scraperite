import "../globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar/index";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toaster";
import { locales, type ValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";
import { AuthProvider } from "@/lib/context/auth-context";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: ValidLocale };
}) {
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-6Y7D03NM4P`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 bg-[#FFE566]">
                <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
              </main>
              <Footer dict={dict.footer} />
            </div>
            <Toaster />
          </Providers>
        </AuthProvider>
        <CookieConsent dict={dict.cookies.consent} />
      </body>
    </html>
  );
}
