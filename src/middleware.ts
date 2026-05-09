import { NextRequest, NextResponse } from "next/server";

// All routes use Next.js pages (no static HTML rewrites).
// /v3/* is redirected to root for backwards compatibility.

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/v3" || path.startsWith("/v3/")) {
    const stripped = path.replace(/^\/v3\/?/, "/");
    const url = request.nextUrl.clone();
    url.pathname = stripped || "/";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/v3/:path*"],
};
