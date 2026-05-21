"use client";

// LandingChrome — top-left brand + top-right toggles & CTAs.
// Replaces the iframe-overlay chrome with native v4-token components.

import Link from "next/link";
import type { LandingCopy, Lang } from "@/lib/i18n-landing";
import type { Theme } from "./LandingShell";

interface Props {
  copy: LandingCopy;
  lang: Lang;
  theme: Theme;
  onLang: (l: Lang) => void;
  onTheme: (t: Theme) => void;
}

export function LandingChrome({ copy, lang, theme, onLang, onTheme }: Props) {
  return (
    <header className="landing-chrome" role="banner">
      <Link href="/about" className="landing-chrome__brand" aria-label="About SolSentry">
        <img
          src="/logo-3d.webp"
          alt=""
          width={28}
          height={28}
          fetchPriority="high"
          decoding="async"
        />
        <span>SolSentry</span>
      </Link>

      <div className="landing-chrome__actions">
        <div
          role="group"
          aria-label={copy.toggleLang}
          className="landing-toggle"
        >
          <button
            type="button"
            aria-pressed={lang === "en"}
            onClick={() => onLang("en")}
            className={lang === "en" ? "is-active" : ""}
          >
            EN
          </button>
          <button
            type="button"
            aria-pressed={lang === "pt"}
            onClick={() => onLang("pt")}
            className={lang === "pt" ? "is-active" : ""}
          >
            PT
          </button>
        </div>

        <button
          type="button"
          className="landing-theme-btn"
          aria-label={copy.toggleTheme}
          aria-pressed={theme === "light"}
          onClick={() => onTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? copy.themeLight : copy.themeDark}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        <Link href="/about" className="landing-link-ghost">
          {copy.navAbout}
        </Link>
        <Link href="/api" className="landing-link-outline">
          {copy.navDev}
        </Link>
        <Link href="/pro" className="landing-link-primary">
          {copy.navPro}
        </Link>
      </div>
    </header>
  );
}
