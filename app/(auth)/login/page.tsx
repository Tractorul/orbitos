"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // If already authenticated, redirect to home
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace("/");
          return;
        }
      } catch (err) {
        console.warn("[Auth] Failed to check initial session:", err);
      } finally {
        setCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Te rugăm să introduci adresa de email și parola.");
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project") || supabaseUrl.includes("placeholder")) {
      setError("Variabilele Supabase nu sunt configurate. Adaugă datele valide în fișierul .env.local.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Emailul sau parola introdusă este incorectă.");
        } else if (authError.message.toLowerCase().includes("email not confirmed")) {
          setError("Adresa de email nu a fost confirmată în panoul Supabase.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/");
        router.refresh();
      } else {
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "A apărut o problemă la conectare.";
      setError(msg);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <GlassCard variant="accent" className="p-8 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-nord-8 mx-auto" />
        <p className="text-xs text-nord-4/60">Verificare sesiune...</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="accent" className="p-6 sm:p-8 space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-nord-8 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-nord-8" />
          <span>Acces Securizat</span>
        </div>
        <h2 className="text-xl font-bold text-nord-6">{t.auth.signInTitle}</h2>
        <p className="text-xs text-nord-4/70 leading-relaxed">
          {t.auth.signInSubtitle}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-nord-11/15 border border-nord-11/30 text-nord-11 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5"
            htmlFor="email"
          >
            {t.auth.emailLabel}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nord-4/40" />
            <input
              id="email"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.emailPlaceholder}
              autoComplete="email"
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5"
            htmlFor="password"
          >
            {t.auth.passwordLabel}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nord-4/40" />
            <input
              id="password"
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.passwordPlaceholder}
              autoComplete="current-password"
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(136,192,208,0.3)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Se autentifică...</span>
            </>
          ) : (
            <span>{t.auth.signInBtn}</span>
          )}
        </Button>
      </form>

      <div className="text-center pt-3 border-t border-white/[0.07] space-y-2">
        <p className="text-[11px] text-nord-4/50 leading-relaxed">
          Conturile au acces administrat și sunt gestionate direct prin Supabase.
        </p>
        <p>
          <Link
            href="/"
            className="text-xs text-nord-4/60 hover:text-nord-8 transition-colors inline-flex items-center gap-1"
          >
            {t.auth.backToDashboard}
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}
