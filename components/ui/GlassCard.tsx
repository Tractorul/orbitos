"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive" | "accent" | "bordered";
  glow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl relative overflow-hidden transition-all duration-200",
          // Variants
          variant === "default" && "glass-card",
          variant === "subtle" &&
            "bg-white/[0.03] backdrop-blur-md border border-white/[0.05] shadow-sm",
          variant === "interactive" && "glass-card-interactive cursor-pointer",
          variant === "accent" && "glass-card-accent",
          variant === "bordered" &&
            "bg-transparent border border-white/10 backdrop-blur-md",
          // Glow effect
          glow && "ring-1 ring-nord-8/35 shadow-[0_0_25px_-3px_rgba(136,192,208,0.25)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
