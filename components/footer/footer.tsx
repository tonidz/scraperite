"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Instagram, Youtube, Facebook, ArrowRight, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  dict: {
    resellers: string;
    privacy: string;
    cookieSettings: string;
  };
}

export function Footer({ dict }: FooterProps) {
  const params = useParams();
  const lang = params.lang as "en" | "sv";
  const currentYear = new Date().getFullYear();

  const resetCookieConsent = () => {
    localStorage.removeItem("cookie-consent");
    // Reload the page to show the consent banner
    window.location.reload();
  };

  return (
    <footer className="relative z-20 bg-gradient-to-r from-black to-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section with Logo and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-gray-800">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">ScrapeRite</h2>
            <p className="text-gray-400 mt-2">Professional Plastic Scrapers</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/scraperite_sverige/"
              className="hover:text-yellow-400 transition-colors"
              target="_blank"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCojkkCaS0Sg0_6MeXafGIUA"
              className="hover:text-yellow-400 transition-colors"
              target="_blank"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/scraperite_sverige/"
              className="hover:text-yellow-400 transition-colors"
              target="_blank"
            >
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Bottom Section with Links and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <p className="text-gray-400">© {currentYear} MMCK AB</p>
            <Link
              href={`/${lang}/privacy-policy`}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              {dict.privacy}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCookieConsent}
              className="text-gray-400 hover:text-yellow-400"
            >
              <Cookie className="h-4 w-4 mr-2" />
              {dict.cookieSettings}
            </Button>
          </div>

          <Link
            href={`/${lang}/login`}
            className="group flex items-center px-6 py-3 mt-6 md:mt-0 bg-red-600/20 hover:bg-red-600/30 text-red-400 
                     hover:text-red-300 rounded-full transition-all duration-300 border border-red-600/50"
          >
            <span>{dict.resellers}</span>
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
