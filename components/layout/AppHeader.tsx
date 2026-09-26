"use client";

import { useState, useEffect } from "react";
import { Plus, Orbit as OrbitIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  formatRomanianDate,
  formatRomanianTime,
  getRomanianGreeting,
  t,
} from "@/lib/i18n";

interface AppHeaderProps {
  onQuickAdd?: () => void;
  title?: string;
  subtitle?: string;
}

export function AppHeader({ onQuickAdd, title, subtitle }: AppHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [greeting, setGreeting] = useState<string>(getRomanianGreeting());

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(formatRomanianTime(now));
      setDateStr(formatRomanianDate(now));
      setGreeting(getRomanianGreeting(now));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="pt-safe px-1 sm:px-2 pt-2 pb-2 sticky top-0 z-30 bg-[#070A0F]/75 backdrop-blur-2xl border-b border-white/[0.05]">
      <div className="flex items-center justify-between">
        {/* Left: Brand Icon + Greeting & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nord-8/20 to-nord-10/20 border border-nord-8/30 flex items-center justify-center text-nord-8 shadow-[0_0_16px_rgba(136,192,208,0.2)] shrink-0">
            <OrbitIcon className="w-5 h-5 animate-spin" style={{ animationDuration: "35s" }} />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-nord-6 flex items-center gap-2">
              {title || greeting}
            </h1>

            <p className="text-xs text-nord-4/70 flex items-center gap-1.5 font-medium">
              {subtitle || (
                <>
                  <span>{dateStr || "Astăzi"}</span>
                  {timeStr && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-nord-8 font-mono">{timeStr}</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Quick Add Pill (Hidden on mobile when FAB is present, visible on tablet/desktop) */}
        {onQuickAdd && (
          <Button
            variant="primary"
            size="sm"
            onClick={onQuickAdd}
            aria-label="Adăugare rapidă"
            className="hidden sm:inline-flex rounded-full px-3.5 h-8 shadow-[0_0_16px_rgba(136,192,208,0.35)]"
          >
            <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.8]" />
            <span className="text-xs font-semibold">{t.header.quickAdd}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
