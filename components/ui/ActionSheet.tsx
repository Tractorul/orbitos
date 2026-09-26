"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ActionSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070A0F]/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        className={cn(
          "relative z-10 w-full max-w-lg bg-[#0E1524]/92 border-t sm:border border-white/[0.12] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.7)] sm:shadow-2xl backdrop-blur-2xl animate-slide-up pb-safe",
          "max-h-[92vh] overflow-y-auto"
        )}
      >
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.07]">
          <div>
            {title && (
              <h3 id="sheet-title" className="text-base font-semibold text-nord-6 tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-nord-4/70 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Închide"
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-nord-4 hover:text-nord-6 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-nord-8"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
