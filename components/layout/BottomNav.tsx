"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  CalendarDays,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: t.nav.home,
      href: "/",
      icon: Compass,
    },
    {
      name: t.nav.tasks,
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: t.nav.calendar,
      href: "/calendar",
      icon: CalendarDays,
    },
    {
      name: t.nav.notes,
      href: "/notes",
      icon: FileText,
    },
    {
      name: t.nav.more,
      href: "/more",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div
      aria-label="Navigare mobilă"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto pointer-events-none"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <nav className="pointer-events-auto glass-nav rounded-[26px] p-1.5 px-2 flex items-center justify-around shadow-[0_12px_36px_rgba(0,0,0,0.65)] border border-white/[0.12]">
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
                "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 min-h-[48px] relative group select-none",
                isActive
                  ? "text-nord-8 font-semibold bg-white/[0.07] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  : "text-nord-4/60 hover:text-nord-4 hover:bg-white/[0.03]"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all duration-200",
                  isActive && "scale-105"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-nord-8 drop-shadow-[0_0_10px_rgba(136,192,208,0.6)]"
                      : "text-nord-4/70 group-hover:text-nord-5"
                  )}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
              </div>

              <span
                className={cn(
                  "text-[10px] tracking-tight transition-all font-medium leading-none mt-0.5",
                  isActive ? "text-nord-8 font-semibold" : "text-nord-4/60"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
