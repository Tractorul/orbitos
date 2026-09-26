"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  CalendarDays,
  FileText,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function DesktopNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: t.nav.home,
      href: "/",
      icon: Compass,
      description: "Prezentare generală și orar",
    },
    {
      name: t.nav.tasks,
      href: "/tasks",
      icon: CheckSquare,
      description: "Sarcini și acțiuni de azi",
    },
    {
      name: t.nav.calendar,
      href: "/calendar",
      icon: CalendarDays,
      description: "Evenimente și program",
    },
    {
      name: t.nav.notes,
      href: "/notes",
      icon: FileText,
      description: "Gânduri și idei rapide",
    },
    {
      name: t.nav.more,
      href: "/more",
      icon: SlidersHorizontal,
      description: "Setări, orar și preferințe",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.08] bg-[#0A0F1A]/70 backdrop-blur-3xl p-5 shrink-0 min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nord-8 via-[#9ed2df] to-nord-10 flex items-center justify-center shadow-[0_0_20px_rgba(136,192,208,0.35)] shrink-0">
          <Sparkles className="w-5 h-5 text-[#070A0F]" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-nord-6 tracking-tight flex items-center gap-1.5">
            Orbit
            <span className="text-[10px] font-mono font-bold uppercase bg-nord-8/20 text-nord-8 px-1.5 py-0.5 rounded-md border border-nord-8/30">
              8G
            </span>
          </h1>
          <p className="text-[11px] text-nord-4/60 font-medium">{t.app.tagline}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1" aria-label="Navigare desktop">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 group text-sm select-none",
                isActive
                  ? "bg-white/[0.08] text-nord-8 font-bold border border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                  : "text-nord-4/70 hover:text-nord-6 hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-105 shrink-0",
                  isActive ? "text-nord-8 drop-shadow-[0_0_8px_rgba(136,192,208,0.5)]" : "text-nord-4/60 group-hover:text-nord-5"
                )}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-xs sm:text-sm">{item.name}</span>
                <span className="block text-[11px] text-nord-4/40 truncate">
                  {item.description}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-nord-8 shadow-[0_0_8px_#88C0D0]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.06] text-xs text-nord-4/50 px-3">
        <p className="font-semibold text-nord-4/80">Nord Frosted OS</p>
        <p className="text-[11px] mt-0.5">Optimizat pentru telefon</p>
      </div>
    </aside>
  );
}
