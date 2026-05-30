"use client";

import { useRouter } from "next/navigation";
import { SolSentrySearch } from "@/components/SolSentrySearch";
import { detectKind, routeFor } from "@/components/AISearchBar";

/* Lab mount of the v0 search redesign (#01) wired to the REAL routing.
 * The live LandingHero AISearchBar is untouched — this proves the visual +
 * routing before any production swap. onSearch reuses the canonical
 * detectKind/routeFor exported by the existing AISearchBar. */
export default function SearchLabPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-6">
        <h1 className="h3">01 · AISearchBar redesign (routing-wired)</h1>
        <SolSentrySearch
          variant="hero"
          onSearch={(value) => {
            const target = routeFor(detectKind(value), value);
            if (target) router.push(target);
          }}
        />
        <p className="p-small">
          Visual = v0 redesign. Routing = canonical detectKind/routeFor from the
          live AISearchBar. Live landing not modified — swap is a deliberate
          follow-up.
        </p>
      </div>
    </div>
  );
}
