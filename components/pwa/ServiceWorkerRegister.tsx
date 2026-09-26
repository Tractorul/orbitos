"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";

export function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial online status
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Register Service Worker in production or supporting browsers
      if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-nord-11/90 text-nord-6 text-xs font-medium py-1.5 px-4 backdrop-blur-md animate-fade-in border-b border-nord-11/40"
      style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top, 0px))" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span>{t.common.offlineBanner}</span>
    </div>
  );
}
