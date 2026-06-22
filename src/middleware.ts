import { NextRequest, NextResponse } from "next/server";

/**
 * Allowlist-based middleware (default-deny).
 *
 * Public routes: / · /about · /docs · /changelog · /mcp · /api · /architecture
 *                /telegram · /scan
 *
 * Everything else → 307 redirect to / + X-Robots-Tag: noindex.
 * Static assets, Next internals, and /api route handlers are always allowed.
 *
 * Pages are NOT deleted — just unreachable via this middleware.
 */

// Prefixes that bypass the allowlist entirely (Next internals + static assets)
const ALWAYS_ALLOW_PREFIXES = [
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap",
  "/images/",
  "/icons/",
  "/fonts/",
  "/og/",
  "/logo",
  "/public/",
];

// Public route prefixes (exact or prefix match)
const ALLOWLIST_PREFIXES = [
  "/", // homepage (exact handled below)
  "/about",
  "/docs",
  "/changelog",
  "/mcp",
  "/api",
  "/architecture",
  "/telegram",
  "/scan",
];

function isAllowed(pathname: string): boolean {
  // Always allow static / Next internals
  for (const prefix of ALWAYS_ALLOW_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) return true;
  }

  // Homepage exact
  if (pathname === "/") return true;

  // Allowlisted prefixes
  for (const prefix of ALLOWLIST_PREFIXES) {
    if (prefix === "/") continue; // handled above
    // Allow exact match or sub-path: /about, /about/..., /docs, /docs/...
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy /v3/* redirect (kept from prior middleware)
  if (pathname === "/v3" || pathname.startsWith("/v3/")) {
    const stripped = pathname.replace(/^\/v3\/?/, "/");
    const url = request.nextUrl.clone();
    url.pathname = stripped || "/";
    return NextResponse.redirect(url, 301);
  }

  if (isAllowed(pathname)) {
    return NextResponse.next();
  }

  // Blocked: redirect to homepage + noindex header
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";
  const response = NextResponse.redirect(redirectUrl, 307);
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico / robots.txt / sitemap.xml
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
