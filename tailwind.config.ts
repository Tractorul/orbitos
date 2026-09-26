import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090D14",
        foreground: "#ECEFF4",
        orbit: {
          darkest: "#090D14",
          darker: "#0E141E",
          dark: "#141C28",
          card: "rgba(20, 28, 40, 0.65)",
          cardHover: "rgba(28, 38, 54, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          borderFocus: "rgba(136, 192, 208, 0.4)",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        nord: {
          0: "#2E3440",
          1: "#3B4252",
          2: "#434C5E",
          3: "#4C566A",
          4: "#D8DEE9",
          5: "#E5E9F0",
          6: "#ECEFF4",
          7: "#8FBCBB",
          8: "#88C0D0",
          9: "#81A1C1",
          10: "#5E81AC",
          11: "#BF616A",
          12: "#D08770",
          13: "#EBCB8B",
          14: "#A3BE8C",
          15: "#B48EAD",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glassGlow: "0 0 20px -2px rgba(136, 192, 208, 0.15)",
        floating: "0 12px 40px -8px rgba(0, 0, 0, 0.6)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
