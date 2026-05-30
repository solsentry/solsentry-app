"use client";

import { useRouter } from "next/navigation";
import { SolSentrySearch } from "@/components/SolSentrySearch";
import { detectKind, routeFor } from "@/components/AISearchBar";
import { SiteTopbar } from "@/components/SiteTopbar";

/**
 * Shared navigation for all internal pages.
 *
 * Topbar: Always uses <SiteTopbar /> — the single source of truth
 * (exactly the same as the homepage).
 *
 * Extra navigation links (Live, MCP, Telegram, etc.) live only in the footer.
 * The only thing added here on internal pages is a compact search bar.
 */
export function Nav() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    const kind = detectKind(value);
    const target = routeFor(kind, value);
    if (target) {
      router.push(target);
    } else {
      router.push(`/lookup?addr=${encodeURIComponent(value)}`);
    }
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <SiteTopbar />

        {/* Compact search — only on internal pages (homepage has its own big search) */}
        <div className="hidden md:block" style={{ flex: "0 1 260px", minWidth: 0, marginLeft: 16 }}>
          <SolSentrySearch variant="nav" onSearch={handleSearch} />
        </div>
      </div>
    </nav>
  );
}
