"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { detectLang } from "@/lib/i18n-landing";
import { BetaAccessModal } from "@/components/BetaAccessModal";

/**
 * SiteTopbar — the single source of truth for the top navigation.
 *
 * This component aims to be used everywhere so the experience is identical:
 * - Easy / Pro / Dev mode selector
 * - EN / PT language toggle
 * - Dark / Light theme
 * - Login / Profile
 * - Subtle API transparency links (Live stats, Operator example, Health)
 *
 * Currently used on homepage via LandingChrome (will be unified).
 * Regular pages still use the older Nav.tsx during migration.
 */
export function SiteTopbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  // Determine active mode based on current route
  const getActiveMode = () => {
    if (!pathname) return "easy";

    if (pathname.startsWith("/pro") || pathname.startsWith("/dashboard")) return "pro";
    if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/docs") ||
      pathname.startsWith("/architecture") ||
      pathname.startsWith("/skills") ||
      pathname.startsWith("/x402")
    )
      return "dev";

    // Only mark Easy as active on the homepage itself
    if (pathname === "/") return "easy";

    return null; // no mode active (e.g. on /about, /pricing, etc.)
  };

  const activeMode = getActiveMode();

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("solsentry-lang") as "en" | "pt" | null;
      const savedTheme = localStorage.getItem("solsentry-theme") as "dark" | "light" | null;

      // Saved pref wins; otherwise reflect the browser language (pt-* → PT).
      setLang(detectLang(savedLang));
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {}
  }, []);

  const toggleLang = (newLang: "en" | "pt") => {
    if (newLang === lang) return;
    setLang(newLang);
    try {
      localStorage.setItem("solsentry-lang", newLang);
    } catch {}
    // Re-render with the new language (server pages + lang-aware bodies read
    // the pref on load). A reload is the simplest reliable apply across the
    // mixed server/client page tree.
    window.location.reload();
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("solsentry-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header
      className="landing-chrome"
      role="banner"
      style={{
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)",
        maxWidth: "1280px", // ou o mesmo valor do seu container
        width: "100%",
      }}
    >
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="landing-chrome__brand">
            <img src="/logo-3d.webp" alt="" width={28} height={28} />
            <span>SolSentry</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Mode tabs - new padrão (mesmo do ProShell) */}
            <div
              className="hidden lg:inline-flex"
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: 2,
                overflow: "hidden",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              <Link
                href="/"
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  color: activeMode === "easy" ? "var(--brand-amber)" : "var(--fg-2)",
                  background: activeMode === "easy" ? "var(--brand-amber-tint)" : "transparent",
                  textDecoration: "none",
                  fontWeight: activeMode === "easy" ? 600 : 400,
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11,
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                Easy
              </Link>

              <span
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "var(--border)",
                  margin: "0 2px",
                }}
              />

              <div
                title="Closed beta! Soon!"
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  color: "var(--fg-3)",
                  background: "transparent",
                  textDecoration: "none",
                  fontWeight: 400,
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  cursor: "not-allowed",
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                Pro
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>

              <span
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "var(--border)",
                  margin: "0 2px",
                }}
              />

              <Link
                href="/api"
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  color: activeMode === "dev" ? "var(--brand-amber)" : "var(--fg-2)",
                  background: activeMode === "dev" ? "var(--brand-amber-tint)" : "transparent",
                  textDecoration: "none",
                  fontWeight: activeMode === "dev" ? 600 : 400,
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11,
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                Dev
              </Link>
            </div>

            {/* About */}
            <Link
              href="/about"
              className="hidden md:flex"
              style={{
                fontSize: 12,
                padding: "10px 14px",
                minHeight: 38,
                display: "flex",
                alignItems: "center",
                background: "var(--surface)",
                color: "var(--fg-2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                textDecoration: "none",
                transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
              }}
            >
              About
            </Link>

            {/* Changelog */}
            <Link
              href="/changelog"
              className="hidden md:flex"
              style={{
                fontSize: 12,
                padding: "10px 14px",
                minHeight: 38,
                display: "flex",
                alignItems: "center",
                background: "var(--surface)",
                color: "var(--fg-2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                textDecoration: "none",
                transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
              }}
            >
              Changelog
            </Link>

            {/* Language - exact same as ProShell */}
            <div
              style={{
                display: "inline-flex",
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
            >
              <button
                onClick={() => toggleLang("en")}
                style={{
                  padding: "10px 14px",
                  background: lang === "en" ? "var(--brand-amber-tint)" : "transparent",
                  color: lang === "en" ? "var(--brand-amber)" : "var(--fg-2)",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 38,
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                EN
              </button>
              <button
                onClick={() => toggleLang("pt")}
                style={{
                  padding: "10px 14px",
                  background: lang === "pt" ? "var(--brand-amber-tint)" : "transparent",
                  color: lang === "pt" ? "var(--brand-amber)" : "var(--fg-2)",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 38,
                  transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
                }}
              >
                PT
              </button>
            </div>

            {/* Theme - exact same as ProShell */}
            <button
              onClick={toggleTheme}
              style={{
                minWidth: 38,
                height: 38,
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                color: "var(--fg-2)",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 110ms ease, color 110ms ease, opacity 110ms ease",
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            {/* Request Beta (Global) */}
            <BetaAccessModal
              triggerClassName="flex items-center gap-2 rounded-md bg-[rgba(217,119,6,0.1)] px-4 py-2 text-sm font-semibold text-[var(--brand-amber)] transition-colors hover:bg-[rgba(217,119,6,0.2)] border border-[var(--brand-amber)]/20 min-h-[38px]"
            >
              Request Beta
            </BetaAccessModal>

            {/* Auth - exact same pill style as ProShell */}
            {/* Login/Pro removed — closed beta launches July 2026 */}
            <div
              title="Closed beta! Soon!"
              className="hidden sm:flex"
              style={{
                fontSize: 12,
                padding: "10px 14px",
                minHeight: 38,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface)",
                color: "var(--fg-3)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                cursor: "not-allowed",
                fontWeight: 500,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
              Connect Wallet
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginLeft: 2 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
