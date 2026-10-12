import { NextRequest, NextResponse } from "next/server";

// The site is a single page. Old paths (shared links to pages that no longer exist) land on it.
// Static files in public/ (including /.well-known/) are served before this runs.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/((?!_next/|favicon|fonts/|logo|\\.well-known/|app/).*)"],
};
