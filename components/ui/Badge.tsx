"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "cyan" | "blue" | "green" | "yellow" | "red" | "purple" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors",
        // Sizes
        size === "sm" && "text-[10px] px-2 py-0.5 leading-none",
        size === "md" && "text-xs px-2.5 py-1 leading-tight",
        // Variants (Muted luxury Nord)
        variant === "default" && "bg-white/[0.06] text-nord-4/90 border border-white/[0.08]",
        variant === "cyan" &&
          "bg-nord-8/15 text-nord-8 border border-nord-8/30 shadow-[0_0_12px_rgba(136,192,208,0.15)]",
        variant === "blue" && "bg-nord-9/15 text-nord-9 border border-nord-9/30",
        variant === "green" && "bg-nord-14/15 text-nord-14 border border-nord-14/30",
        variant === "yellow" && "bg-nord-13/15 text-nord-13 border border-nord-13/30",
        variant === "red" && "bg-nord-11/15 text-nord-11 border border-nord-11/30",
        variant === "purple" && "bg-nord-15/15 text-nord-15 border border-nord-15/30",
        variant === "outline" && "border border-white/15 text-nord-4/80 bg-transparent",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "cyan" && "bg-nord-8 animate-pulse",
            variant === "blue" && "bg-nord-9",
            variant === "green" && "bg-nord-14",
            variant === "yellow" && "bg-nord-13",
            variant === "red" && "bg-nord-11",
            variant === "purple" && "bg-nord-15",
            variant === "default" && "bg-nord-4/60",
            variant === "outline" && "bg-white/40"
          )}
        />
      )}
      {children}
    </span>
  );
}
