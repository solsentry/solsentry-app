import { NextRequest, NextResponse } from "next/server";

// Promote sds7 static HTML to the site root (no /v3 prefix).
//
// Rewrites (URL stays the same in the browser, content swapped):
//   /              → /index.html
//   /dashboard     → /dashboard.html
//   /explorer      → /explorer.html
//   /everything    → /everything.html
//   /docs          → /docs.html        (overrides the old Next.js /docs)
//
// 301 redirect: any /v3/* request → strip /v3 prefix.
//
// Everything else (/contact, /compare, /api, /mcp, /roadmap, /partners,
// /telegram, /submit, /alerts, /clusters, /resolutions, /token, /operator,
// /me, /drain, /fun, /glossary, /labels, /leaderboard, /watchlist, /ask,
// /cluster) stays on the existing Next.js pages.

const REWRITES: Record<string, string> = {
  "/": "/index.html",
  "/dashboard": "/dashboard.html",
  "/explorer": "/explorer.html",
  "/everything": "/everything.html",
  "/docs": "/docs.html",
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/v3" || path.startsWith("/v3/")) {
    const stripped = path.replace(/^\/v3\/?/, "/");
    const url = request.nextUrl.clone();
    url.pathname = stripped || "/";
    return NextResponse.redirect(url, 301);
  }

  const target = REWRITES[path];
  if (target) {
    return NextResponse.rewrite(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/explorer", "/everything", "/docs", "/v3/:path*"],
};
