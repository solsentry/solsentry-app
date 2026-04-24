import { NextRequest, NextResponse } from "next/server";

// Promote v3 to the site root without visibly changing the URL.
//
// Rewrites (URL stays the same in the browser, content swapped):
//   /              → /v3/index.html
//   /dashboard     → /v3/dashboard.html
//   /explorer      → /v3/explorer.html
//   /everything    → /v3/everything.html
//   /docs          → /v3/docs.html        (overrides the old Next.js /docs)
//
// Everything else (/contact, /compare, /api, /mcp, /roadmap, /partners,
// /telegram, /submit, /alerts, /clusters, /resolutions, /token, /operator,
// /me, /drain, /fun, /glossary, /labels, /leaderboard, /watchlist, /ask,
// /cluster) stays on the existing Next.js pages.

const V3_REWRITES: Record<string, string> = {
  "/": "/v3/index.html",
  "/dashboard": "/v3/dashboard.html",
  "/explorer": "/v3/explorer.html",
  "/everything": "/v3/everything.html",
  "/docs": "/v3/docs.html",
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const target = V3_REWRITES[path];
  if (target) {
    return NextResponse.rewrite(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/explorer", "/everything", "/docs"],
};
