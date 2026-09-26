"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass" | "outline";
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-nord-8/50 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 select-none",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-nord-8 via-[#9cd1df] to-nord-7 text-[#070A0F] font-semibold rounded-2xl shadow-[0_4px_20px_-2px_rgba(136,192,208,0.45)] hover:shadow-[0_6px_25px_0px_rgba(136,192,208,0.6)] border border-white/25",
          variant === "secondary" &&
            "bg-[#151D2D]/80 hover:bg-[#1C273C]/90 text-nord-6 border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-sm",
          variant === "glass" &&
            "bg-white/[0.06] hover:bg-white/[0.12] text-nord-6 border border-white/[0.1] backdrop-blur-xl rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]",
          variant === "ghost" &&
            "text-nord-4/80 hover:text-nord-6 hover:bg-white/[0.06] rounded-xl",
          variant === "outline" &&
            "border border-white/15 text-nord-5 hover:bg-white/[0.06] hover:border-white/25 rounded-2xl backdrop-blur-sm",
          variant === "danger" &&
            "bg-nord-11/15 text-nord-11 border border-nord-11/30 hover:bg-nord-11/25 rounded-2xl backdrop-blur-md",
          // Sizes
          size === "sm" && "text-xs px-3.5 py-1.5 h-8 gap-1.5 rounded-xl font-medium",
          size === "md" && "text-xs sm:text-sm px-4 py-2.5 h-10 gap-2 rounded-2xl",
          size === "lg" && "text-sm sm:text-base px-5 py-3 h-12 gap-2.5 rounded-2xl font-semibold",
          size === "icon" && "h-10 w-10 p-0 rounded-2xl",
          size === "icon-sm" && "h-8 w-8 p-0 rounded-xl text-xs",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
