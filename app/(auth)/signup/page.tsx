"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { Lock, Mail } from "lucide-react";

export default function SignupPage() {
  return (
    <GlassCard variant="accent" className="p-6 sm:p-8 space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-nord-6">{t.auth.signUpTitle}</h2>
        <p className="text-xs text-nord-4/70 leading-relaxed">
          {t.auth.signUpSubtitle}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5" htmlFor="email">
            {t.auth.emailLabel}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nord-4/40" />
            <input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder}
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5" htmlFor="password">
            {t.auth.passwordLabel}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nord-4/40" />
            <input
              id="password"
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
          </div>
        </div>

        <Button variant="primary" className="w-full mt-2 py-3 rounded-2xl font-bold">
          {t.auth.signUpBtn}
        </Button>
      </form>

      <div className="text-center pt-3 border-t border-white/[0.07] space-y-2.5">
        <p className="text-xs text-nord-4/70 font-medium">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="text-nord-8 hover:underline font-bold">
            {t.auth.signInBtn}
          </Link>
        </p>
        <p>
          <Link href="/" className="text-xs text-nord-4/50 hover:text-nord-4 transition-colors">
            {t.auth.backToDashboard}
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}
