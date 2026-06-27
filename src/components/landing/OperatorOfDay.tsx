"use client";

// OperatorOfDay — pulls top operator from /v1/top-operators (RSC-fetched
// and passed in). 4kxscute fallback is intentional: the live API is
// stable enough that this is rarely needed, but we never want a dead
// section if the API is slow.

import Link from "next/link";
import { Skull } from "lucide-react";
import type { LandingCopy } from "@/lib/i18n-landing";

export interface TopOperatorPayload {
  ok: boolean;
  wallet: string;
  confirmedRugs?: number;
  totalTokens?: number;
  rugRatePct?: number;
  tags?: string[];
  isFallback?: boolean;
}

interface Props {
  copy: LandingCopy;
  data: TopOperatorPayload;
}

function shortWallet(w: string): string {
  if (w.length <= 14) return w;
  return `${w.slice(0, 6)}…${w.slice(-4)}`;
}

export function OperatorOfDay({ copy, data }: Props) {
  return null;
}
