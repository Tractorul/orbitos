"use client";

import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { QuickAddModal } from "@/components/layout/QuickAddModal";
import { Plus } from "lucide-react";

export default function OrbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen text-[#ECEFF4] flex flex-col md:flex-row antialiased selection:bg-nord-8/30">
      {/* Desktop Sidebar Navigation */}
      <DesktopNav />

      {/* Main Mobile-First Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-8 relative">
        <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-4">
          {children}
        </main>
      </div>

      {/* Mobile Floating Quick Add Action Button (FAB) */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          aria-label="Adăugare rapidă"
          className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-tr from-nord-8 via-[#9ed2df] to-nord-7 text-[#070A0F] flex items-center justify-center shadow-[0_8px_25px_rgba(136,192,208,0.5)] active:scale-90 hover:scale-105 transition-all duration-200 border border-white/40 group"
        >
          <Plus className="w-6 h-6 stroke-[2.8] transition-transform group-hover:rotate-90 duration-200" />
        </button>
      </div>

      {/* Quick Add Modal Sheet */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
