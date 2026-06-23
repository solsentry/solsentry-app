"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

      if (savedLang) setLang(savedLang);
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {}
  }, []);

  const toggleLang = (newLang: "en" | "pt") => {
    setLang(newLang);
    localStorage.setItem("solsentry-lang", newLang);
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

            {/* Auth - exact same pill style as ProShell */}
            {/* Login/Pro removed — open beta launches July 2026 */}
          </div>
        </div>
      </div>
    </header>
  );
}
