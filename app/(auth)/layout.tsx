import { Sparkles } from "lucide-react";
import { t } from "@/lib/i18n";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090D14] flex flex-col justify-center items-center p-4 antialiased selection:bg-nord-8/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nord-8 to-nord-10 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(136,192,208,0.4)]">
            <Sparkles className="w-6 h-6 text-[#090D14]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-nord-6">Orbit</h1>
          <p className="text-xs text-nord-4/60">{t.app.tagline}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
