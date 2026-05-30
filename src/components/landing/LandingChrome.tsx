"use client";

// LandingChrome — top-left brand + top-right toggles & CTAs.
// Easy / Pro / Dev mode switcher on the public homepage.

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
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="landing-chrome__brand" aria-label="SolSentry home">
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
            {/* Mode tabs — Easy (free, active) / Pro / Dev (locked, upsell) */}
            <div className="landing-mode-tabs" role="tablist" aria-label="Experience modes">
              <button
                type="button"
                className="mode-tab active"
                title="Free quick scan • instant • rate limited by RPC"
                aria-selected
              >
                Easy
              </button>
              <Link
                href="/pro"
                className="mode-tab locked"
                title="Pro: unlimited scans, watchlists, alerts, full history. Login required."
              >
                Pro <span style={{ fontSize: "10px", opacity: 0.8 }}>🔒</span>
              </Link>
              <Link
                href="/api"
                className="mode-tab locked"
                title="Dev: API, MCP server, raw endpoints. Login + credits."
              >
                Dev <span style={{ fontSize: "10px", opacity: 0.8 }}>🔒</span>
              </Link>
            </div>

            {/* About - more to the left on homepage as requested */}
            <Link href="/about" className="landing-link-ghost">
              About
            </Link>

            <div role="group" aria-label={copy.toggleLang} className="landing-toggle">
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

            {/* Auth area */}
            <Link href="/login" className="landing-link-ghost">
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
