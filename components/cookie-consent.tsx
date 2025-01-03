"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CookieConsentProps {
  dict: {
    title: string;
    description: string;
    accept: string;
    decline: string;
    customize: string;
  };
}

export function CookieConsent({ dict }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      // Initialize GA only if cookies were accepted
      initializeGA();
    }
  }, []);

  const initializeGA = () => {
    // Initialize Google Analytics
    window.gtag("js", new Date());
    window.gtag("config", "G-6Y7D03NM4P", {
      page_path: window.location.pathname,
    });
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
    initializeGA();
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{dict.title}</h3>
            <p className="text-gray-600 text-sm">{dict.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="text-gray-600"
            >
              {dict.decline}
            </Button>
            <Button size="sm" onClick={acceptCookies}>
              {dict.accept}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
