"use client";

// LandingShell — owns the lang + theme state for the v4 native landing.
// Renders all children through a tiny render-prop so each landing block
// receives the resolved copy + theme without prop-drilling explicitly.
//
// Theme: dark default. Light is a CSS-variable override scoped to
// `[data-theme="light"]` (defined in globals.css).
// Lang: persists to localStorage under solsentry-lang.
//
// No external context provider — scope is intentionally just the landing.

import { useCallback, useEffect, useState } from "react";
import {
  COPY,
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  type Lang,
  type LandingCopy,
  detectLang,
} from "@/lib/i18n-landing";

const THEME_KEY = "solsentry-theme";
type Theme = "dark" | "light";

interface RenderProps {
  copy: LandingCopy;
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
}

export function LandingShell({
  children,
}: {
  children: (props: RenderProps) => React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Read persisted prefs after mount — avoids SSR/CSR hydration mismatch.
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (storedLang) setLangState(detectLang(storedLang));
      if (storedTheme === "light" || storedTheme === "dark") {
        setThemeState(storedTheme);
      }
    } catch {
      // localStorage unavailable (private mode / SSR fallback) — defaults stand.
    }
    setMounted(true);
  }, []);

  // Apply theme attribute on <html> for global CSS scoping.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", lang);
  }, [theme, lang, mounted]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  return <>{children({ copy: COPY[lang], lang, theme, setLang, setTheme })}</>;
}

export type { Theme };
