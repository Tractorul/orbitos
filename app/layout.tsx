import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Orbit",
  description: "Sistem de operare mobil personal și tablou de bord",
  applicationName: "Orbit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orbit",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#070A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className="dark h-full bg-[#070A0F] text-[#ECEFF4] antialiased selection:bg-nord-8/30 selection:text-nord-6"
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="h-full bg-[#070A0F] text-[#ECEFF4] font-sans overflow-x-hidden relative ambient-bg min-h-screen">
        {/* Fixed Atmospheric Glow Orbs (Subtle Nord Ambience) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          {/* Top-Left Frost Cyan Orb */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-nord-8/[0.07] blur-3xl" />
          {/* Top-Right Deep Blue Orb */}
          <div className="absolute top-20 -right-32 w-80 h-80 rounded-full bg-nord-10/[0.08] blur-3xl" />
          {/* Center-Left Polar Night Glow */}
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-nord-9/[0.05] blur-3xl" />
          {/* Bottom-Right Aurora Glow */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-nord-7/[0.06] blur-3xl" />
        </div>

        <ServiceWorkerRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
